import pytest
from app import app, init_db

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        init_db()
        yield client

def unique_email():
    import time
    return "test_{}@example.com".format(int(time.time()*1000))

def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "running"

def test_register_success(client):
    res = client.post("/api/register", json={"name": "Test User", "email": unique_email(), "password": "pass123"})
    assert res.status_code == 200
    assert "email" in res.get_json()

def test_register_missing_fields(client):
    res = client.post("/api/register", json={"name": "Test"})
    assert res.status_code == 400

def test_register_duplicate_email(client):
    email = unique_email()
    client.post("/api/register", json={"name": "User", "email": email, "password": "pass123"})
    res = client.post("/api/register", json={"name": "User2", "email": email, "password": "pass456"})
    assert res.status_code == 409

def test_login_success(client):
    email = unique_email()
    client.post("/api/register", json={"name": "User", "email": email, "password": "pass123"})
    res = client.post("/api/login", json={"email": email, "password": "pass123"})
    assert res.status_code == 200

def test_login_wrong_password(client):
    email = unique_email()
    client.post("/api/register", json={"name": "User", "email": email, "password": "pass123"})
    res = client.post("/api/login", json={"email": email, "password": "wrongpass"})
    assert res.status_code == 401

def test_login_nonexistent_email(client):
    res = client.post("/api/login", json={"email": "nobody@nowhere.com", "password": "pass"})
    assert res.status_code == 401

def test_calculate_food(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_travel(client):
    res = client.post("/api/calculate", json={"category": "travel", "item": "car", "quantity": 10, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_energy(client):
    res = client.post("/api/calculate", json={"category": "energy", "item": "electricity", "quantity": 5, "user_email": "guest"})
    assert res.status_code == 200
    assert res.get_json()["co2_kg"] > 0

def test_calculate_missing_item(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 400

def test_calculate_invalid_category(client):
    res = client.post("/api/calculate", json={"category": "invalid", "item": "beef", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 400

def test_calculate_unknown_item(client):
    res = client.post("/api/calculate", json={"category": "food", "item": "unicorn", "quantity": 1, "user_email": "guest"})
    assert res.status_code == 400

def test_reset_clears_log(client):
    client.post("/api/calculate", json={"category": "food", "item": "beef", "quantity": 1, "user_email": "resettest@test.com"})
    res = client.post("/api/reset", json={"user_email": "resettest@test.com"})
    assert res.status_code == 200
    log = client.get("/api/log?user_email=resettest@test.com")
    assert log.get_json()["activities"] == []

def test_find_account_not_exists(client):
    res = client.post("/api/find-account", json={"email": "ghost@nowhere.com"})
    assert res.status_code == 404

def test_find_account_invalid_input(client):
    res = client.post("/api/find-account", json={})
    assert res.status_code in [400, 404]

def test_reset_password_no_fields(client):
    res = client.post("/api/reset-password", json={})
    assert res.status_code == 400

def test_reset_password_missing_new_password(client):
    res = client.post("/api/reset-password", json={"email": "anyone@test.com"})
    assert res.status_code == 400