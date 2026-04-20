from auth import get_password_hash, verify_password

def test_password_hashing():
    password = "mysecretpassword"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False

def test_token_creation():
    from auth import create_access_token
    token = create_access_token(data={"sub": "test@example.com"})
    assert isinstance(token, str)
    assert len(token) > 0
