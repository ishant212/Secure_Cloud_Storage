# 🔐 Secure Cloud 

> End-to-end encrypted cloud storage powered by FastAPI, React, and Google Drive.  
> Encrypt locally • Store securely • Access anywhere

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react)
![Google Drive](https://img.shields.io/badge/Google%20Drive-Storage-yellow?style=flat-square&logo=googledrive)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen?style=flat-square)

---

# 📖 Overview

Secure Cloud 2.0 is an encrypted cloud storage platform designed to ensure files remain private before they ever leave the user’s device.

Every uploaded file is encrypted locally using **AES-GCM (256-bit authenticated encryption)**. Only encrypted ciphertext is stored in Google Drive.

When downloading:

1. File is retrieved from Google Drive
2. Ciphertext is decrypted
3. Original filename and MIME type are restored

The project focuses on delivering **practical security with minimal architecture complexity**.

---

# ✨ Key Features

## 🔒 Encryption Layer

- AES-GCM authenticated encryption
- 256-bit encryption support
- Integrity verification during decryption
- Random nonce generated per upload
- Metadata protected inside encrypted payload

Encrypted payload includes:

```text
filename ||SPLIT|| mime_type ||SPLIT|| file_data
```

No plaintext metadata is exposed.

---

## ☁️ Cloud Storage

- Upload encrypted blobs to Google Drive
- Preserve original filename internally
- Download and automatically restore content
- Drive acts only as encrypted storage

---

## 🔑 Authentication

- OAuth 2.0 authentication
- No password storage
- Automatic token refresh
- Session persistence via `token.pickle`

---

## 🔄 API & Proxy Architecture

Backend responsibilities:

- Encryption
- Decryption
- Upload handling
- Download handling

Proxy responsibilities:

- CORS management
- Browser communication
- Header forwarding

Frontend responsibilities:

- File selection
- Upload interface
- Download actions

---

# 🗂 Project Structure

```text
secure-cloud-2.0/
│
├── backend/
│   ├── encryption/
│   │   └── crypto.py
│   │       # AES-GCM encryption logic
│   │
│   ├── storage/
│   │   └── cloud.py
│   │       # Google Drive integration
│   │
│   └── main.py
│       # FastAPI API routes
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── index.js
│   │   # Express proxy
│   │
│   └── package.json
│
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

---

# 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| React + Vite | Frontend |
| Tailwind CSS | UI Styling |
| FastAPI | Backend API |
| PyCryptodome | Encryption |
| Express.js | Proxy Server |
| Google Drive API | Cloud Storage |
| OAuth 2.0 | Authentication |

---

# 🚀 Local Setup

## Requirements

- Python 3.8+
- Node.js 16+
- Google Cloud Project
- Google Drive API enabled

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/secure-cloud-2.0.git

cd secure-cloud-2.0
```

---

## Install Backend

```bash
pip install \
fastapi \
uvicorn \
pycryptodome \
google-api-python-client \
google-auth \
google-auth-oauthlib \
google-auth-httplib2 \
python-dotenv \
python-multipart
```

---

## Configure Environment

```bash
cp .env.example .env
```

Update:

```env
AES_KEY=
FOLDER_ID=
```

---

## Start Proxy

```bash
cd server

npm install

node index.js
```

---

## Start Backend

```bash
uvicorn backend.main:app --reload
```

---

## Start Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🌐 Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Proxy | http://localhost:3000 |
| Backend | http://127.0.0.1:8000 |

---

# 🔐 Encryption Workflow

```text
User File
   ↓
AES-GCM Encrypt
   ↓
Bundle Metadata
   ↓
Generate Ciphertext
   ↓
Upload to Drive
   ↓
Download
   ↓
Decrypt
   ↓
Restore Original File
```

---

# ⚠️ Limitations

- Single-user architecture
- No key rotation
- Flat storage structure
- Local OAuth token storage

---

# 🛡 Security Checklist

Before pushing:

```text
credentials.json
token.pickle
.env
cryptography-proj-*.json
```

Never commit these files.

Rotate credentials immediately if leaked.

---

# 🔮 Future Scope

- Multi-user support
- AWS S3 integration
- Dropbox integration
- Shareable encrypted links
- Client-side preview
- Large file chunking
- Deployment automation

---

# 👤 Author

**Your Name**

GitHub:
https://github.com/YOUR_USERNAME

---

### Built to keep data encrypted from upload to retrieval.