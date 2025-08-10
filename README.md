# Secure Photo App

A full-stack application for securely uploading, storing, and managing photos. The project consists of a React frontend and a Python backend, with support for authentication, cloud storage, and a modern user experience.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Testing](#testing)
- [License](#license)
- [Contact](#contact)

## Features
- User authentication
- Secure photo uploads
- Cloud storage integration (Azure Blob)
- View and manage your uploads
- Responsive React frontend
- RESTful backend API

## Project Structure
```
backend/
  auth.py
  azure_blob.py
  db.py
  main.py
  models.py
  requirements.txt
  upload.py
  uploads/
frontend/
  api-server.js
  package.json
  README.md
  server.js
  public/
  src/
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js (v14+ recommended)
- npm or yarn

## Backend Setup
1. Navigate to the `backend` directory:
   ```powershell
   cd backend
   ```
2. (Recommended) Create a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Set up environment variables in a `.env` file (see below).
5. Start the backend server:
   ```powershell
   cd backend
   uvicorn main:app --reload                                          
   ```

## Frontend Setup
1. Navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend development server:
   ```powershell
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Environment Variables

### Backend (`backend/.env`)
```
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url

# Auth0 Configuration
AUTH0_DOMAIN=''
API_IDENTIFIER=''
ALGORITHMS=''

# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost/db_name

```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:5000
```

## API Integration
The frontend communicates with the backend API for authentication and photo management. Update `REACT_APP_API_URL` in your `.env` file to match your backend server address.

