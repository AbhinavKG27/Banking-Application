# Kodbank - Full Stack Banking Web Application

Kodbank is a simple full-stack banking web app with secure authentication, customer-only access, and protected balance checks.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** Aiven MySQL
- **Auth:** JWT + httpOnly cookies (stateless), bcrypt password hashing

## Folder Structure

```text
Banking-Application/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/authMiddleware.js
│   ├── models/
│   │   ├── tokenModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/styles.css
│   ├── js/auth.js
│   ├── js/dashboard.js
│   ├── index.html
│   └── userdashboard.html
└── sql/
    └── schema.sql
```

## Setup

1. Create database tables using:
   ```sql
   SOURCE sql/schema.sql;
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   ```
   Fill in Aiven MySQL credentials and JWT secret.
4. Start server:
   ```bash
   npm run dev
   ```
5. Open app:
   - `http://localhost:5000`

## Security & Flow Mapping

- Registration hashes password with bcrypt before insert.
- Role enforcement only allows `Customer`.
- Login validates password, issues JWT (`sub=username`, `role` claim, `1h` expiry).
- JWT is stored in `UserToken` table and returned as `httpOnly` cookie.
- `/api/user/balance` requires valid signed JWT + non-expired DB token record.
- No sessions and no sessionStorage are used.

