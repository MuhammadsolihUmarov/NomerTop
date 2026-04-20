import pytest

def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "name": "Test User", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_user(client):
    # Register first
    client.post(
        "/auth/register",
        json={"email": "login@example.com", "name": "Login User", "password": "password123"}
    )
    
    # Login
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_password(client):
    client.post(
        "/auth/register",
        json={"email": "fail@example.com", "name": "Fail User", "password": "password123"}
    )
    
    response = client.post(
        "/auth/login",
        json={"email": "fail@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
