import pytest
from app import app, init_db, get_db


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """
    Configure the app for testing and ensure tables exist once per session.
    """
    app.config["TESTING"] = True
    init_db()


@pytest.fixture(autouse=True)
def clean_db():
    """
    Wipe the users and activities tables before every single test.

    This guarantees each test starts from a known, empty state instead
    of accumulating leftover rows from previous test runs.
    """
    conn = get_db()
    conn.execute("DELETE FROM users")
    conn.execute("DELETE FROM activities")
    conn.commit()
    conn.close()
    yield