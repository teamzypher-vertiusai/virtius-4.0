import pytest
import sys
import os
from PIL import Image
import numpy as np

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.binary_engine import BinaryEngine

def test_zero_out_manipulation():
    # Create a dummy image
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save("test_binary.png")
    
    BinaryEngine.zero_out_manipulation("test_binary.png", "test_binary_protected.png")
    
    assert os.path.exists("test_binary_protected.png")
    
    # Verify image is still valid
    protected_img = Image.open("test_binary_protected.png")
    assert protected_img.format == "PNG"
    
    # Check if manipulation actually changed bytes (simple check)
    with open("test_binary.png", "rb") as f1, open("test_binary_protected.png", "rb") as f2:
        assert f1.read() != f2.read()
        
    os.remove("test_binary.png")
    os.remove("test_binary_protected.png")

def test_manipulation_score():
    # Mock score calculation
    score = BinaryEngine.calculate_manipulation_score("path/to/original", "path/to/protected")
    assert 0 <= score <= 100
