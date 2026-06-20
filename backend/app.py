from flask import Flask, request, jsonify
from flask_cors import CORS
from carbon_data import FOOD_EMISSIONS, TRAVEL_EMISSIONS, ENERGY_EMISSIONS
from claude_nudge import get_nudge, get_daily_summary
from groq import Groq
from werkzeug.security import generate_password_hash, check_password_hash
import os, json, re, sqlite3
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from datetime import datetime


load_dotenv()

app = Flask(__name__)
CORS(app, origins=["https://carbon-nudge.vercel.app"])

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[],
    storage_uri="memory://"
)

@app.before_request
def check_limiter():
    if app.config.get("TESTING", False):
        limiter.enabled = False
    else:
        limiter.enabled = True

# --- DATABASE SETUP ---
def get_db():
    conn = sqlite3.connect("carbon_nudge.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            joined_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            activity TEXT NOT NULL,
            co2_kg REAL NOT NULL,
            category TEXT NOT NULL,
            nudge TEXT,
            logged_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

# --- AUTH ROUTES ---
@app.route("/api/register", methods=["POST"])
@limiter.limit("5 per minute")
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    # Strong password validation
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if not re.search(r'[A-Z]', password):
        return jsonify({"error": "Password must contain at least one uppercase letter"}), 400
    if not re.search(r'[a-z]', password):
        return jsonify({"error": "Password must contain at least one lowercase letter"}), 400
    if not re.search(r'[0-9]', password):
        return jsonify({"error": "Password must contain at least one number"}), 400
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return jsonify({"error": "Password must contain at least one special character"}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO users (name, email, password, joined_at) VALUES (?, ?, ?, ?)",
            (name, email, hashed_password, datetime.now().isoformat())
        )
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        return jsonify({"name": user["name"], "email": user["email"], "joinedAt": user["joined_at"]})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409
    finally:
        conn.close()


@app.route("/api/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"name": user["name"], "email": user["email"], "joinedAt": user["joined_at"]})


# --- ACTIVITY ROUTES ---
@app.route("/api/calculate", methods=["POST"])
def calculate():
    data = request.json
    category = data.get("category")
    item = data.get("item")
    quantity = float(data.get("quantity", 1))
    user_email = data.get("user_email", "guest")

    if not category or not item:
        return jsonify({"error": "category and item are required"}), 400

    if category == "food":
        factor = FOOD_EMISSIONS.get(item, 0)
        unit = "serving(s)"
    elif category == "travel":
        factor = TRAVEL_EMISSIONS.get(item, 0)
        unit = "km"
    elif category == "energy":
        factor = ENERGY_EMISSIONS.get(item, 0)
        unit = "unit(s)"
    else:
        return jsonify({"error": "Invalid category"}), 400

    if factor == 0:
        return jsonify({"error": f"Item '{item}' not found in {category}"}), 400

    co2 = round(factor * quantity, 3)
    activity_label = f"{quantity} {unit} of {item} ({category})"
    nudge = get_nudge(activity_label, co2)

    conn = get_db()
    conn.execute(
        "INSERT INTO activities (user_email, activity, co2_kg, category, nudge, logged_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_email, activity_label, co2, category, nudge, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

    return jsonify({"activity": activity_label, "co2_kg": co2, "nudge": nudge})


@app.route("/api/log", methods=["GET"])
def get_log():
    user_email = request.args.get("user_email", "guest")
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM activities WHERE user_email = ? ORDER BY logged_at DESC",
        (user_email,)
    ).fetchall()
    conn.close()
    return jsonify({"activities": [dict(r) for r in rows]})


@app.route("/api/summary", methods=["GET"])
def summary():
    user_email = request.args.get("user_email", "guest")
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM activities WHERE user_email = ?", (user_email,)
    ).fetchall()
    conn.close()

    if not rows:
        return jsonify({"message": "No activities logged yet!"}), 200

    activities = [dict(r) for r in rows]
    total_co2 = round(sum(a["co2_kg"] for a in activities), 3)
    summary_text = get_daily_summary(activities)
    return jsonify({"total_co2_kg": total_co2, "activities": activities, "summary": summary_text})


@app.route("/api/reset", methods=["POST"])
def reset():
    user_email = request.json.get("user_email", "guest")
    conn = get_db()
    conn.execute("DELETE FROM activities WHERE user_email = ?", (user_email,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Activity log cleared!"})


@app.route("/api/tips", methods=["POST"])
def tips():
    data = request.json
    context = data.get("context", "The user hasn't logged any activities yet.")

    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"""{context}

Give 3 personalized, specific, actionable tips to reduce their carbon footprint. Respond ONLY with a valid JSON array, no markdown, no extra text:
[
  {{"emoji": "🚲", "title": "Short tip title", "desc": "One sentence with a specific number or fact.", "color": "#4edea3"}},
  {{"emoji": "🥗", "title": "Short tip title", "desc": "One sentence with a specific number or fact.", "color": "#ff9f43"}},
  {{"emoji": "💡", "title": "Short tip title", "desc": "One sentence with a specific number or fact.", "color": "#54a0ff"}}
]"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400
    )
    text = response.choices[0].message.content.strip()
    clean = re.sub(r'```json|```', '', text).strip()
    return jsonify(json.loads(clean))


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "running", "message": "Carbon Nudge API is live!"})

@app.route("/api/find-account", methods=["POST"])
def find_account():
    email = request.json.get("email")
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    if not user:
        return jsonify({"error": "No account found with this email."}), 404
    return jsonify({"message": "Account found!"})

@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    email = request.json.get("email")
    new_password = request.json.get("new_password")
    if not email or not new_password:
        return jsonify({"error": "Email and new password required."}), 400
    hashed_password = generate_password_hash(new_password)
    conn = get_db()
    conn.execute("UPDATE users SET password = ? WHERE email = ?", (hashed_password, email))
    conn.commit()
    conn.close()
    return jsonify({"message": "Password updated!"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)