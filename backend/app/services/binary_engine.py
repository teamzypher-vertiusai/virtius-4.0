import os
import shutil
import numpy as np
from PIL import Image
from typing import Tuple

class BinaryEngine:
    @staticmethod
    def zero_out_manipulation(image_path: str) -> str:
        """
        Applies zero-out manipulation to specific bytes and RGB shifts.
        Args:
            image_path (str): Path to the original image.
        Returns:
            str: Path to the protected image.
        """
        try:
            # Create output path
            directory, filename = os.path.split(image_path)
            name, ext = os.path.splitext(filename)
            protected_path = os.path.join(directory, f"{name}_protected{ext}")

            # Open image and convert to numpy array
            with Image.open(image_path) as img:
                # Preserve metadata
                info = img.info
                
                # Convert to RGB to ensure consistency
                img_rgb = img.convert('RGB')
                data = np.array(img_rgb)
                
                # 1. Zero-out strategic bytes (every 8th byte in flattened array)
                # We operate on a copy to avoid read-only issues
                flat_data = data.flatten()
                # Set every 8th byte to 0 (simulating bit-rot/watermark without destroying image)
                # Using a small offset to avoid header corruption if we were doing raw binary
                # But here we are working on pixel data, so it's safe visual noise
                flat_data[::8] = 0
                
                # Reshape back to original dimensions
                data_zeroed = flat_data.reshape(data.shape)
                
                # 2. RGB Shift (Invisible noise)
                # Add slight random noise to Blue channel (least sensitive to human eye)
                noise = np.random.randint(0, 2, data_zeroed.shape, dtype='uint8')
                # Only apply to Blue channel (index 2)
                data_zeroed[:, :, 2] = np.bitwise_xor(data_zeroed[:, :, 2], noise[:, :, 2])

                # Create protected image
                protected_img = Image.fromarray(data_zeroed)
                
                # Save with original format and metadata
                protected_img.save(protected_path, quality=95, **info)
                
            return protected_path
        except Exception as e:
            raise Exception(f"Binary manipulation failed: {str(e)}")

    @staticmethod
    def validate_image_integrity(original_path: str, protected_path: str) -> bool:
        """
        Validates that the protected image is still a valid image file.
        Args:
            original_path (str): Path to original image.
            protected_path (str): Path to protected image.
        Returns:
            bool: True if valid, False otherwise.
        """
        try:
            with Image.open(protected_path) as img:
                img.verify()
            return True
        except Exception:
            return False

    @staticmethod
    def calculate_manipulation_score(original_path: str, protected_path: str) -> float:
        """
        Calculates the percentage of difference between original and protected images.
        Args:
            original_path (str): Path to original image.
            protected_path (str): Path to protected image.
        Returns:
            float: Manipulation score (0-100%).
        """
        try:
            img1 = Image.open(original_path).convert('RGB')
            img2 = Image.open(protected_path).convert('RGB')
            
            arr1 = np.array(img1)
            arr2 = np.array(img2)
            
            if arr1.shape != arr2.shape:
                return 0.0
                
            # Calculate mean squared error
            mse = np.mean((arr1 - arr2) ** 2)
            
            # Normalize to a score (heuristic)
            # A small MSE implies subtle changes (good for invisible protection)
            # We want to return a score indicating "effectiveness" of change
            score = min(100.0, mse * 10) 
            return float(score)
        except Exception:
            return 0.0
