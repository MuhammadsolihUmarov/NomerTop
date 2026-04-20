import pytest

@pytest.fixture
def auth_header(client):
    client.post(
        "/auth/register",
        json={"email": "plate@example.com", "name": "Plate User", "password": "password123"}
    )
    response = client.post(
        "/auth/login",
        json={"email": "plate@example.com", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_register_plate(client, auth_header):
    response = client.post(
        "/plates",
        json={"number": "01A777AA", "country": "UZ", "brand": "Chevrolet", "model": "Malibu"},
        headers=auth_header
    )
    assert response.status_code == 200
    assert response.json()["number"] == "01A777AA"

def test_get_plate(client, auth_header):
    # Register plate first
    client.post(
        "/plates",
        json={"number": "01B111BB", "country": "UZ", "brand": "Kia", "model": "K5"},
        headers=auth_header
    )
    
    response = client.get("/plates/01B111BB")
    assert response.status_code == 200
    assert response.json()["number"] == "01B111BB"
    assert response.json()["owner"]["name"] == "Plate User"

def test_internal_auth_header(client):
    # Test server-to-server call via X-User-Id
    client.post(
        "/auth/register",
        json={"email": "internal@example.com", "name": "Internal User", "password": "password123"}
    )
    login_resp = client.post(
        "/auth/login",
        json={"email": "internal@example.com", "password": "password123"}
    )
    token = login_resp.json()["access_token"]
    
    # Get ID from /users/me
    me_resp = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    user_id = me_resp.json()["id"]
    
    response = client.post(
        "/plates",
        json={"number": "01C222CC", "country": "UZ"},
        headers={"X-User-Id": user_id}
    )
    assert response.status_code == 200
    assert response.json()["number"] == "01C222CC"
