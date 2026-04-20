import pytest
from datetime import datetime, timedelta

def test_send_otp(client):
    phone = "+998901234567"
    response = client.post("/auth/otp/send", json={"phone": phone})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "debug_code" in data
    assert data["debug_code"] == "123456"

def test_otp_login_new_user(client):
    phone = "+998998887766"
    # 1. Send OTP
    client.post("/auth/otp/send", json={"phone": phone})
    
    # 2. Login with correct code
    response = client.post("/auth/otp/login", json={"phone": phone, "code": "123456"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_otp_login_wrong_code(client):
    phone = "+998901112233"
    client.post("/auth/otp/send", json={"phone": phone})
    
    response = client.post("/auth/otp/login", json={"phone": phone, "code": "000000"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired OTP"

def test_otp_login_existing_user(client):
    phone = "+998905554433"
    # Register user first via standard auth
    client.post("/auth/register", json={"email": "existing@example.com", "phone": phone, "name": "Existing User", "password": "password123"})
    
    # Try OTP login
    client.post("/auth/otp/send", json={"phone": phone})
    response = client.post("/auth/otp/login", json={"phone": phone, "code": "123456"})
    
    assert response.status_code == 200
    assert "access_token" in response.json()
