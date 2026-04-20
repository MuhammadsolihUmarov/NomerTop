import pytest

@pytest.fixture
def auth_header_2(client):
    client.post(
        "/auth/register",
        json={"email": "cover2@example.com", "phone": "+998112223344", "name": "Coverage User", "password": "password123"}
    )
    response = client.post(
        "/auth/login",
        json={"email": "cover2@example.com", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_register_duplicate_email(client):
    client.post("/auth/register", json={"email": "dup@example.com", "name": "A", "password": "p"})
    response = client.post("/auth/register", json={"email": "dup@example.com", "name": "B", "password": "p"})
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_register_duplicate_phone(client):
    client.post("/auth/register", json={"email": "u1@example.com", "phone": "+998887776655", "name": "A", "password": "p"})
    response = client.post("/auth/register", json={"email": "u2@example.com", "phone": "+998887776655", "name": "B", "password": "p"})
    assert response.status_code == 400
    assert "Phone number already registered" in response.json()["detail"]

def test_login_with_phone(client):
    client.post("/auth/register", json={"email": "phone_login@example.com", "phone": "+998776665544", "name": "Phone User", "password": "p"})
    response = client.post("/auth/login", json={"phone": "+998776665544", "password": "p"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_protected_routes_unauthorized(client):
    assert client.get("/users/me").status_code == 401
    assert client.get("/users/me/plates").status_code == 401
    assert client.post("/plates", json={}).status_code == 401

def test_send_message_and_notifications(client, auth_header_2):
    # 1. Register plate for auth_header_2 user
    client.post("/plates", json={"number": "SIGNAL01", "country": "UZ"}, headers=auth_header_2)
    
    # 2. Send message from anonymous sender
    response = client.post("/messages", json={
        "plateNumber": "SIGNAL01",
        "content": "Move your car please!",
        "senderName": "Stranger"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    
    # 3. Check notifications for target user
    resp_notif = client.get("/users/me/notifications", headers=auth_header_2)
    assert resp_notif.status_code == 200
    notifs = resp_notif.json()
    assert len(notifs) > 0
    assert notifs[0]["body"] == "Move your car please!"

def test_get_my_plates(client, auth_header_2):
    client.post("/plates", json={"number": "MINE01", "country": "UZ"}, headers=auth_header_2)
    client.post("/plates", json={"number": "MINE02", "country": "UZ"}, headers=auth_header_2)
    
    response = client.get("/users/me/plates", headers=auth_header_2)
    assert response.status_code == 200
    plates = response.json()
    assert len(plates) >= 2
    assert any(p["number"] == "MINE01" for p in plates)
    assert any(p["number"] == "MINE02" for p in plates)

def test_plate_not_found(client):
    response = client.get("/plates/NONEXISTENT")
    assert response.status_code == 404

def test_send_message_plate_not_found(client):
    response = client.post("/messages", json={"plateNumber": "NOTHERE", "content": "Hello"})
    assert response.status_code == 404

def test_register_plate_duplicate(client, auth_header_2):
    client.post("/plates", json={"number": "DUPPLATE", "country": "UZ"}, headers=auth_header_2)
    response = client.post("/plates", json={"number": "DUPPLATE", "country": "UZ"}, headers=auth_header_2)
    assert response.status_code == 400
