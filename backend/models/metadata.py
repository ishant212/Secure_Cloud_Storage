import json
import os

DB_FILE = "metadata.json"

def save_metadata(file_id, nonce, key, filename):
    data = load_all()

    data[file_id] = {
        "nonce": nonce.hex(),
        "key": key,
        "filename": filename
    }

    with open(DB_FILE, "w") as f:
        json.dump(data, f)

def get_metadata(file_id):
    data = load_all()
    return data.get(file_id)

def load_all():
    if not os.path.exists(DB_FILE):
        return {}
    with open(DB_FILE, "r") as f:
        return json.load(f)