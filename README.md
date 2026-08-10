# EngPractice ⚡

EngPractice is a full-stack web application designed for learning, creating, and practicing English language quizzes. Built with a modern tech stack—**React 18 (Vite)** on the frontend, and **Express / MongoDB** on the backend—the application features user-based quiz custom deck creation, automated practice sessions with session statistics, and secure cookie-based session persistence.

---

## 🌟 Features

### 💻 Frontend (Client)
- **User Authentication:** Sleek registration and login forms with local input validation and secure authentication state.
- **Two Main Panels:**
  - **📖 Practice Tab:** Shows an interactive card deck of all user-created quizzes shuffled using the Fisher-Yates algorithm. Shows instant answer feedback (correct/incorrect) and tracks session score and streak count (persisted via `localStorage`).
  - **➕ Add Quiz (Manage) Tab:** Contains a **Quiz Creator Form** (requires a question, exactly 4 options, and designates one option as the correct answer) and a **Practice Quizzes Grid** (displays cards for each created quiz, lets you test-run individual quizzes, and provides a confirmation delete dialog).
- **Modern UI & UX:** Premium Glassmorphic card styling, responsive flex/grid layouts, smooth scale transitions, custom scrollbars, spin/bounce animations, and dynamic Toast alert portal (Success, Warning, Info, and Error alerts).

### ⚙️ Backend (Server)
- **RESTful API Architecture:** Clean routing structure dividing authentication and quiz resource domains.
- **Secure Sessions:** JWT-based user authentication using HTTP-only, secure, and cross-site cookies (`sameSite: "none"`).
- **Security:** Hashed user passwords using Bcrypt (10 salt rounds) and token-based API request authorization.
- **Database Integration:** Flexible data models managed by Mongoose (MongoDB ODM) with field validation (e.g., email uniqueness, minimum password length, and exactly 4 options per quiz).
- **Enhanced Connection:** Connects to MongoDB Atlas using Google/Cloudflare public DNS servers for robust network resolution.

---

## 📁 Repository Structure

```
EngPractice/
├── backend/                   # Express.js Server
│   ├── src/
│   │   ├── config/            # DB Connection Config
│   │   ├── controller/        # Request Handlers (Auth & Quizzes)
│   │   ├── middleware/        # Request Authentication Middleware
│   │   ├── model/             # Mongoose Schemas (User & Quiz)
│   │   ├── routes/            # Route Mappings
│   │   └── utils/             # Helper Utilities (JWT Token Generator)
│   ├── index.js               # Application Entry Point
│   ├── package.json           # Backend Dependencies & Scripts
│   └── .env                   # Backend Environment Variables (ignored)
├── frontend/                  # React + Vite Client
│   ├── src/
│   │   ├── components/        # UI Components (Auth, Navbar, Quiz, etc.)
│   │   ├── App.jsx            # Main App Layout & State Manager
│   │   ├── index.css          # Tailwind Directives & Animations
│   │   └── main.jsx           # App Bootstrapper
│   ├── package.json           # Frontend Dependencies & Scripts
│   ├── vite.config.js         # Vite Bundler Settings
│   └── index.html             # HTML Shell
└── README.md                  # Project Documentation
```

---

## 🛠️ Tech Stack

- **Frontend:**
  - React 18
  - Vite 5
  - Tailwind CSS v4
  - Fetch API (Cookie-based credentials)
- **Backend:**
  - Node.js & Express 5
  - MongoDB & Mongoose 9
  - JSON Web Tokens (jsonwebtoken 9)
  - Bcrypt 6
  - Cookie Parser 1.4
  - CORS 2.8

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v18+ recommended)
- A MongoDB cluster (local MongoDB instance or MongoDB Atlas account)

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd EngPractice
```

#### 2. Backend Configuration
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```
The server will boot up and listen on port `3000` (or the configured `PORT`).

#### 3. Frontend Configuration
Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend application will start and run on `http://localhost:5173`.

---

## 🔌 API Endpoints Reference

### Authentication Routes (`/api/auth`)
| HTTP Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Registers a new user & sets JWT session cookie | No |
| `POST` | `/api/auth/login` | Validates credentials & sets JWT session cookie | No |
| `POST` | `/api/auth/logout` | Clears the JWT session cookie | No |
| `GET` | `/api/auth/me` | Fetches details of the currently logged-in user | Yes |

### Quiz Routes (`/api/quizzes`)
*All quiz endpoints require a valid authenticated user session (verified via JWT cookie).*

| HTTP Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/quizzes` | Creates a new quiz |
| `GET` | `/api/quizzes` | Retrieves all quizzes created by the current user |
| `GET` | `/api/quizzes/:id` | Fetches details of a specific quiz |
| `PUT` | `/api/quizzes/:id` | Updates a specific quiz |
| `DELETE` | `/api/quizzes/:id` | Deletes a specific quiz |

---

## 🔒 Security & Session Flow

1. The user registers or logs in via the frontend.
2. The server authenticates the credentials, generates a JSON Web Token, and sets it as an HTTP-only cookie named `jwt`.
3. The frontend includes `credentials: 'include'` on all fetch requests (facilitated by the `apiCall` wrapper in the application).
4. The server intercepts requests to protected routes (`/api/quizzes/*` and `/api/auth/me`) using `authenticate` middleware to decode the token and verify the user session.
5. Logging out clears the `jwt` cookie on the client browser.
