import pytest
import sys
import os

# Add parent directory to path to allow importing app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.crypto_engine import CryptoEngine

def test_key_generation():
    private_key, public_key = CryptoEngine.generate_key_pair()
    assert private_key is not None
    assert public_key is not None
    assert len(private_key) > 0
    assert len(public_key) > 0

def test_hashing():
    # Create a dummy file
    content = b"test content"
    with open("test_hash.txt", "wb") as f:
        f.write(content)
    
    file_hash = CryptoEngine.create_hash("test_hash.txt")
    assert file_hash is not None
    assert len(file_hash) == 64 # SHA256 hex string length
    
    os.remove("test_hash.txt")

def test_signing_and_verification():
    private_key, public_key = CryptoEngine.generate_key_pair()
    content_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" # Empty file hash
    
    signature = CryptoEngine.sign_content(content_hash, private_key)
    assert signature is not None
    
    is_valid = CryptoEngine.verify_signature(content_hash, signature, public_key)
    assert is_valid is True
    
    is_invalid = CryptoEngine.verify_signature("wrong_hash", signature, public_key)
    assert is_invalid is False
