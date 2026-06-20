import pytest
from app import app, init_db

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    app.config["TESTING"] = True
    init_db()