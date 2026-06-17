from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_nudge(activity: str, co2_kg: float) -> str:
    prompt = f"""You are a carbon footprint awareness assistant.
The user just logged: {activity} producing {co2_kg:.2f} kg CO2.

Give exactly 3 things:
1. One powerful emotional nudge (1 sentence with a shocking relatable comparison)
2. One simple action they can take RIGHT NOW to reduce it
3. One surprising fun fact about this activity's environmental impact

Keep total response under 80 words. Be conversational, motivating, never preachy.
Use emojis where appropriate."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    return response.choices[0].message.content


def get_daily_summary(activities: list) -> str:
    total_co2 = sum(a["co2_kg"] for a in activities)
    activity_list = "\n".join([f"- {a['activity']}: {a['co2_kg']} kg CO2" for a in activities])

    prompt = f"""You are a carbon footprint coach.

Today's activities:
{activity_list}
Total: {total_co2:.2f} kg CO2

Give a short motivating daily summary (max 80 words):
1. How today compares to average Indian daily footprint (4.5 kg CO2)
2. The biggest change they can make tomorrow
3. An encouraging closing line

Use emojis. Be warm and supportive."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    return response.choices[0].message.content