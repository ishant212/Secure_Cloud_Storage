import json
from Crypto.Cipher import AES

KEY = b'CHOOSE_A_32_BYTE_KEY_FOR_AES_256'  # Must be 32 bytes for AES-256

def encrypt_data(data: bytes, filename: str, mimetype: str) -> dict:
    cipher = AES.new(KEY, AES.MODE_GCM)

    # Bundle filename + mimetype into the payload before encrypting
    meta = json.dumps({"filename": filename, "mimetype": mimetype}).encode()
    payload = meta + b"||SPLIT||" + data

    ciphertext, tag = cipher.encrypt_and_digest(payload)

    return {
        "ciphertext": ciphertext,
        "nonce": cipher.nonce,
        "tag": tag
    }

def decrypt_data(ciphertext: bytes, nonce: bytes, tag: bytes):
    cipher = AES.new(KEY, AES.MODE_GCM, nonce=nonce)
    payload = cipher.decrypt_and_verify(ciphertext, tag)

    # Split metadata from file bytes
    meta_bytes, file_bytes = payload.split(b"||SPLIT||", 1)
    meta = json.loads(meta_bytes.decode())

    return meta, file_bytes  # ← returns ({"filename":..., "mimetype":...}, raw bytes)