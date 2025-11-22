import hashlib
import json
import base64
from typing import Tuple, Dict
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

class CryptoEngine:
    @staticmethod
    def generate_key_pair() -> Tuple[str, str]:
        """
        Generates an Ed25519 key pair.
        Returns:
            Tuple[str, str]: (private_key_pem, public_key_pem)
        """
        private_key = ed25519.Ed25519PrivateKey.generate()
        public_key = private_key.public_key()

        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        return private_pem.decode('utf-8'), public_pem.decode('utf-8')

    @staticmethod
    def create_hash(file_path: str) -> str:
        """
        Creates a SHA256 hash of a file, supporting large files via stream processing.
        Args:
            file_path (str): Path to the file.
        Returns:
            str: Hex digest of the SHA256 hash.
        """
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            # Read in 4MB chunks to support large files without memory issues
            for byte_block in iter(lambda: f.read(4096 * 1024), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    @staticmethod
    def sign_content(file_path: str, private_key_pem: str) -> str:
        """
        Signs the content of a file using the private key.
        Args:
            file_path (str): Path to the file to sign.
            private_key_pem (str): PEM encoded private key.
        Returns:
            str: Base64 encoded signature.
        """
        # First get the hash of the content to sign (efficient for large files)
        content_hash = CryptoEngine.create_hash(file_path)
        
        # Load private key
        private_key = serialization.load_pem_private_key(
            private_key_pem.encode('utf-8'),
            password=None
        )

        # Sign the hash bytes
        signature = private_key.sign(content_hash.encode('utf-8'))
        return base64.b64encode(signature).decode('utf-8')

    @staticmethod
    def verify_signature(file_path: str, signature_b64: str, public_key_pem: str) -> bool:
        """
        Verifies the signature of a file using the public key.
        Args:
            file_path (str): Path to the file.
            signature_b64 (str): Base64 encoded signature.
            public_key_pem (str): PEM encoded public key.
        Returns:
            bool: True if signature is valid, False otherwise.
        """
        try:
            content_hash = CryptoEngine.create_hash(file_path)
            
            public_key = serialization.load_pem_public_key(
                public_key_pem.encode('utf-8')
            )
            
            signature = base64.b64decode(signature_b64)
            
            public_key.verify(signature, content_hash.encode('utf-8'))
            return True
        except Exception:
            return False

    @staticmethod
    def generate_certificate(signature_data: str, content_hash: str, public_key: str) -> str:
        """
        Generates a JSON proof certificate.
        Args:
            signature_data (str): The signature.
            content_hash (str): The content hash.
            public_key (str): The public key used for verification.
        Returns:
            str: JSON string of the certificate.
        """
        certificate = {
            "version": "1.0",
            "algorithm": "Ed25519-SHA256",
            "content_hash": content_hash,
            "signature": signature_data,
            "public_key": public_key,
            "verified": True
        }
        return json.dumps(certificate, indent=2)
