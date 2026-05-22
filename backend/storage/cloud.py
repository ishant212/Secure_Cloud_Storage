import io
import os
import pickle

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

from googleapiclient.discovery import build
from googleapiclient.http import (
    MediaIoBaseUpload,
    MediaIoBaseDownload
)

# =========================
# GOOGLE DRIVE CONFIG
# =========================

SCOPES = ['https://www.googleapis.com/auth/drive']

# Project root directory
PROJECT_ROOT = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

# SERVICE_ACCOUNT_FILE = os.path.join(
#     PROJECT_ROOT,
#     'cryptography-proj-20107ebb5f18.json'
# )

# =========================
# AUTHENTICATION
# =========================
def authenticate_drive():

    creds = None

    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:

        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())

        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json',
                SCOPES
            )

            creds = flow.run_local_server(port=8080,access_type='offline',prompt='consent')

        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)

    return service

# =========================
# UPLOAD FILE
# =========================

def upload_to_drive(
    file_bytes,
    filename,
    original_filename,
    folder_id
):
    try:
        service = authenticate_drive()

        # Store encrypted file in shared folder
        print("UPLOAD FOLDER ID:", folder_id)
        file_metadata = {
            'name': filename + ".enc",
            'description': original_filename,
            'parents': [folder_id]
        }

        media = MediaIoBaseUpload(
            io.BytesIO(file_bytes),
            mimetype='application/octet-stream',
            resumable=False
        )

        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id',
            supportsAllDrives=True
        ).execute()

        print(f"Uploaded file ID: {file.get('id')}")

        return file.get('id')

    except Exception as e:
        print(f"UPLOAD ERROR: {e}")
        raise


# =========================
# DOWNLOAD FILE
# =========================

def download_from_drive(file_id):
    try:
        service = authenticate_drive()

        # Get file metadata
        metadata = service.files().get(
            fileId=file_id,
            fields='name, description, mimeType',
            supportsAllDrives=True
        ).execute()

        filename = metadata.get(
            'description',
            metadata.get('name', 'downloaded_file')
        )

        # Download encrypted blob
        request = service.files().get_media(
            fileId=file_id,
            supportsAllDrives=True
        )

        file_data = io.BytesIO()

        downloader = MediaIoBaseDownload(
            file_data,
            request
        )

        done = False

        while done is False:
            status, done = downloader.next_chunk()

            if status:
                print(
                    f"Download progress: "
                    f"{int(status.progress() * 100)}%"
                )

        file_data.seek(0)

        return file_data.read(), filename

    except Exception as e:
        print(f"DOWNLOAD ERROR: {e}")
        raise   