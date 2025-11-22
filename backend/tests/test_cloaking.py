import pytest
import sys
import os
from PIL import Image

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.cloaking_engine import CloakingEngine

def test_cloaking_application():
    # Create a dummy image
    img = Image.new('RGB', (100, 100), color = 'blue')
    img.save("test_cloaking.png")
    
    CloakingEngine.apply_fawkes_protection("test_cloaking.png", "test_cloaking_protected.png", level="low")
    
    assert os.path.exists("test_cloaking_protected.png")
    
    # Verify image validity
    protected_img = Image.open("test_cloaking_protected.png")
    assert protected_img.size == (100, 100)
    
    os.remove("test_cloaking.png")
    os.remove("test_cloaking_protected.png")

def test_effectiveness_score():
    score = CloakingEngine.check_fawkes_effectiveness("path/to/img")
    assert 0 <= score <= 100
