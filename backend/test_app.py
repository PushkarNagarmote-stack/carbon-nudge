import pytest
import json
from app import app, init_db

@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["RATELIMIT_ENABLED"] = False
    with app.test_client() as client:
        init_db()
        yield client

def unique_email():
    import time
    return "test_{}@example.com".format(int(time.time()*1000))

# ─── HEALTH ───────────────────────────────────────────────
def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "running"

def test_health_method_not_allowed(client):
    res = client.post("/api/health")
    assert res.status_code == 405

# ─── REGISTER ─────────────────────────────────────────────
def test_register_success(client):
    res = client.post("/api/register", json={"name": "Test User", "email": unique_email(), "password": "StrongPass1!"})
    assert res.status_code == 200
    data = res.get_json()
    assert "email" in data
    assert "name" in data

def test_register_returns_name(client):
    email = unique_email()
    res = client.post("/api/register", json={"name": "Pushkar", "email": email, "password": "StrongPass1!"})
    assert res.get_json()["name"] == "Pushkar"

def test_register_missing_name(client):
    res = client.post("/api/register", json={"email": unique_email(), "password": "pass123"})
    assert res.status_code == 400

def test_register_missing_email(client):
    res = client.post("/api/register", json={"name": "User", "password": "pass123"})
    assert res.status_code == 400

def test_register_missing_password(client):
    res = client.post("/api/register", json={"name": "User", "email": unique_email()})
    assert res.status_code == 400

def test_register_missing_all_fields(client):
    res = client.post("/api/register", json={})
    assert res.status_code == 400

def test_register_duplicate_email(client):
    email = unique_email()
    client.post("/api/register", json={"name": "User", "email": email, "password": "StrongPass1!"})
    res = client.post("/api/register", json={"name": "User2", "email": email, "password": "StrongPass2@"})
    assert res.status_code == 409

def test_register_no_body(client):
    res = client.post("/api/register", data="", content_type="application/json")
    assert res.status_code in [400, 500]

def test_register_sql_injection_email(client):
    res = client.post("/api/register", json={"name": "User", "email": "' OR '1'='1", "password": "pass"})
    assert res.status_code in [200, 400, 409, 500]

# ─── LOGIN ────────────────────────────────────────────────
def test_login_success(client):
    email = unique_email()
    client.post("/api/register", json={"name": "User", "email": email, "password": "StrongPass1!"})
    res = client.post("/api/login", json={"email": email, "password": "StrongPass1!"})
    assert res.status_code == 200
    assert res.get_json()["email"] == email

def test_login_returns_name(client):
    email = unique_email()
    client.post("/api/register", json={"name": "Pushkar", "email": email, "password": "StrongPass1!"})
    res = client.post("/api/login", json={"email": email, "password": "StrongPass1!"})
    assert res.get_json()["name"] == "Pushkar"

def test_login_wrong_password(client):
    email = unique_email()
    client.post("/api/register", json={"name": "User", "email": email, "password": "pass123"})
    res = client.post("/api/login", json={"email": email, "password": "wrongpass"})
    assert res.status_code == 401

def test_login_nonexistent_email(client):
    res = client.post("/api/login", json={"email": "nobody@nowhere.com", "password": "pass"})
    assert res.status_code == 401

def test_login_empty_password(client):
    email = unique_email()
    client.post("/api/register", json={"name": "User", "email": email, "password": "pass123"})
    res = client.post("/api/login", json={"email": email, "password": ""})
    assert res.status_code == 401

def test_login_missing_fields(client):
    res = client.post("/api/login", json={})
    assert res.status_code in [400, 401, 500]

def test_login_sql_injection(client):
    res = client.post("/api/login", json={"email": "' OR '1'='1", "password": "' OR '1'='1"})
    assert res.status_code == 401

# ─── CALCULATE ────────────────────────────────────────────
def test_calculate_food_beef(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] == 27.0

def test_calculate_food_chicken(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "chicken", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_food_rice(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "rice", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_food_vegetables(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "vegetables", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_travel_car(client):
    res = client.post("/api/calculate", json={"category": "travel", "item": "car", "quantity": 10, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_travel_bus(client):
    res = client.post("/api/calculate", json={"category": "travel", "item": "bus", "quantity": 10, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_travel_train(client):
    res = client.post("/api/calculate", json={"category": "travel", "item": "train", "quantity": 10, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_travel_flight(client):
    res = client.post("/api/calculate", json={"category": "travel", "item": "flight", "quantity": 100, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_energy_electricity(client):
    res = client.post("/api/calculate", json={"category": "energy", "item": "electricity", "quantity": 5, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_energy_lpg(client):
    res = client.post("/api/calculate", json={"category": "energy", "item": "lpg", "quantity": 2, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_large_quantity(client):
    res = client.post("/api/calculate", json={"category": "travel", "item": "car", "quantity": 10000, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_decimal_quantity(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 0.5, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] == 13.5

def test_calculate_missing_item(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 400

def test_calculate_missing_category(client):
    res = client.post("/api/calculate", json={"category": "", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 400

def test_calculate_invalid_category(client):
    res = client.post("/api/calculate", json={"category": "invalid", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 400

def test_calculate_unknown_item(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "unicorn", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 400

def test_calculate_returns_nudge(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert "nudge" in res.get_json()
    assert len(res.get_json()["nudge"]) > 0

def test_calculate_returns_activity_label(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert "activity" in res.get_json()

def test_calculate_guest_user(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 200

# ─── LOG ──────────────────────────────────────────────────
def test_get_log_empty(client):
    res = client.get("/api/log?user_email=emptyuser@test.com")
    assert res.status_code == 200
    assert res.get_json()["activities"] == []

def test_get_log_after_calculate(client):
    client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "logtest@test.com"})
    res = client.get("/api/log?user_email=logtest@test.com")
    assert res.status_code == 200
    assert len(res.get_json()["activities"]) >= 1

def test_get_log_contains_correct_fields(client):
    client.post("/api/calculate", json={"category": "food", "item": "rice", "quantity": 1, "user_email": "fieldtest@test.com"})
    res = client.get("/api/log?user_email=fieldtest@test.com")
    activity = res.get_json()["activities"][0]
    assert "co2_kg" in activity
    assert "activity" in activity
    assert "category" in activity

# ─── RESET ────────────────────────────────────────────────
def test_reset_clears_log(client):
    client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "resettest@test.com"})
    res = client.post("/api/reset", json={"user_email": "resettest@test.com"})
    assert res.status_code == 200
    log = client.get("/api/log?user_email=resettest@test.com")
    assert log.get_json()["activities"] == []

def test_reset_empty_user(client):
    res = client.post("/api/reset", json={"user_email": "nobody@test.com"})
    assert res.status_code == 200

def test_reset_guest(client):
    res = client.post("/api/reset", json={"user_email": "guest"})
    assert res.status_code == 200

# ─── SUMMARY ──────────────────────────────────────────────
def test_summary_no_activities(client):
    res = client.get("/api/summary?user_email=newsummary@test.com")
    assert res.status_code == 200

def test_summary_with_activities(client):
    client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "summarytest@test.com"})
    res = client.get("/api/summary?user_email=summarytest@test.com")
    assert res.status_code == 200
    data = res.get_json()
    assert "total_co2_kg" in data

# ─── FIND ACCOUNT ─────────────────────────────────────────
def test_find_account_not_exists(client):
    res = client.post("/api/find-account", json={"email": "ghost@nowhere.com"})
    assert res.status_code == 404

def test_find_account_invalid_input(client):
    res = client.post("/api/find-account", json={})
    assert res.status_code in [400, 404]

def test_find_account_empty_email(client):
    res = client.post("/api/find-account", json={"email": ""})
    assert res.status_code in [400, 404]

# ─── RESET PASSWORD ───────────────────────────────────────
def test_reset_password_no_fields(client):
    res = client.post("/api/reset-password", json={})
    assert res.status_code == 400

def test_reset_password_missing_new_password(client):
    res = client.post("/api/reset-password", json={"email": "anyone@test.com"})
    assert res.status_code == 400

def test_reset_password_missing_email(client):
    res = client.post("/api/reset-password", json={"new_password": "newpass123"})
    assert res.status_code == 400

def test_reset_password_nonexistent_user(client):
    res = client.post("/api/reset-password", json={"email": "ghost@nowhere.com", "new_password": "newpass"})
    assert res.status_code == 200

# ─── SECURITY ─────────────────────────────────────────────
def test_sql_injection_login(client):
    res = client.post("/api/login", json={"email": "' DROP TABLE users; --", "password": "x"})
    assert res.status_code in [400, 401, 500]

def test_sql_injection_calculate(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "'; DROP TABLE activities; --", "quantity": 1, "user_email": "guest"})
    assert res.status_code in [400, 500]

def test_xss_in_name(client):
    res = client.post("/api/register", json={"name": "<script>alert('xss')</script>", "email": unique_email(), "password": "pass123"})
    assert res.status_code in [200, 400]

def test_large_payload_register(client):
    res = client.post("/api/register", json={"name": "A" * 10000, "email": unique_email(), "password": "pass123"})
    assert res.status_code in [200, 400, 413]

def test_invalid_json_body(client):
    res = client.post("/api/login", data="not json", content_type="application/json")
    assert res.status_code in [400, 500]

    # ─── PASSWORD STRENGTH ────────────────────────────────────
def test_register_weak_password_too_short(client):
    res = client.post("/api/register", json={"name": "User", "email": unique_email(), "password": "Ab1!"})
    assert res.status_code == 400

def test_register_weak_password_no_uppercase(client):
    res = client.post("/api/register", json={"name": "User", "email": unique_email(), "password": "password1!"})
    assert res.status_code == 400

def test_register_weak_password_no_lowercase(client):
    res = client.post("/api/register", json={"name": "User", "email": unique_email(), "password": "PASSWORD1!"})
    assert res.status_code == 400

def test_register_weak_password_no_number(client):
    res = client.post("/api/register", json={"name": "User", "email": unique_email(), "password": "Password!"})
    assert res.status_code == 400

def test_register_weak_password_no_special(client):
    res = client.post("/api/register", json={"name": "User", "email": unique_email(), "password": "Password1"})
    assert res.status_code == 400

def test_register_strong_password(client):
    res = client.post("/api/register", json={"name": "User", "email": unique_email(), "password": "StrongPass1!"})
    assert res.status_code == 200