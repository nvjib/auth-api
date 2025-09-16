# Auth API

Streamlined authentication with endpoints for registering users, logging in, and securing routes.

## Technologies

- `Node.js`
- `Express.js`
- `Supabase`

## Features

- ✅ User registration with name, email & password
- 🔑 Secure login with JWT authentication
- 👤 Retrieve authenticated user profile

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## Running the Project

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `node server.js`
4. Open `http://localhost:3000` in your browser

## Preview

### Get All Quotes
```http
POST /sign-up
```

**Request:**
```json
[
 {
  "email": "user@example.com",
  "password": "strongpassword123"
 }
]
```

**Response:**
```json
[
 {
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  } 
 }
]
```