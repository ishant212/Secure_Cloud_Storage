from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from .storage.cloud import upload_to_drive, download_from_drive
from .encryption.crypto import encrypt_data, decrypt_data

import io
import traceback

app = FastAPI()

# ==========================================
# GOOGLE DRIVE SHARED FOLDER ID
# ==========================================

FOLDER_ID = "ENTER_YOUR_FOLDER_ID_HERE"
print("USING FOLDER ID:", FOLDER_ID)
# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {"message": "Secure Cloud API Running"}

# ==========================================
# UPLOAD + ENCRYPT
# ==========================================

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read uploaded file
        data = await file.read()

        print(
            f"Received file: {file.filename}, "
            f"size: {len(data)} bytes"
        )

        # Encrypt file
        encrypted = encrypt_data(
            data,
            file.filename,
            file.content_type
        )

        print("Encryption successful")

        # Create binary blob
        # Format:
        # nonce (16) + tag (16) + ciphertext
        blob = (
            encrypted["nonce"] +
            encrypted["tag"] +
            encrypted["ciphertext"]
        )

        # Upload encrypted file to Google Drive
        file_id = upload_to_drive(
            blob,
            file.filename,
            file.filename,
            FOLDER_ID
        )

        print(f"Uploaded to Drive with ID: {file_id}")

        return {
            "success": True,
            "file_id": file_id
        }

    except Exception as e:
        print(f"UPLOAD ERROR: {e}")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ==========================================
# DOWNLOAD + DECRYPT
# ==========================================

@app.get("/download/{file_id}")
def download(file_id: str):
    try:
        # Download encrypted blob
        data, _ = download_from_drive(file_id)

        print(f"Downloaded encrypted file size: {len(data)} bytes")

        # Extract crypto sections
        nonce = data[:16]
        tag = data[16:32]
        ciphertext = data[32:]

        # Decrypt
        meta, decrypted_bytes = decrypt_data(
            ciphertext,
            nonce,
            tag
        )

        # Extract original metadata
        filename = meta.get(
            "filename",
            "downloaded_file"
        )

        mimetype = meta.get(
            "mimetype",
            "application/octet-stream"
        )

        print(f"Decrypted file: {filename}")

        # Return original file
        return StreamingResponse(
            io.BytesIO(decrypted_bytes),
            media_type=mimetype,
            headers={
                "Content-Disposition":
                f'attachment; filename="{filename}"'
            }
        )

    except Exception as e:
        print(f"DOWNLOAD ERROR: {e}")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )