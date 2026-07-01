# SecureID — Security & Identity Management Platform

A full-stack authentication and identity management platform built with React, Node.js, Express, and MongoDB. Goes beyond a basic login system to solve real enterprise security problems: session visibility, threat detection, password hygiene, and admin observability.

## Features

### Authentication Core
- Register / Login / Logout
- Email verification (mock — fully functional flow)
- JWT access tokens (15m) + HttpOnly refresh token cookies (30d)
- Refresh token rotation with in-memory + MongoDB persistence
- CSRF double-submit cookie protection
- Role-Based Access Control (Admin / User)

### Active Sessions Dashboard
- View all devices currently signed in
- Browser, OS, device type detection from User-Agent
- Login time and last activity timestamp
- Revoke individual sessions
- Revoke all sessions (signs out all devices)

### Security Insights & Center
- Security score (0–100) based on account health
- Failed login attempt tracking (30-day window)
- New device login detection and alerting
- Password age tracking with expiry reminders
- Recent activity timeline with event labels
- Account health checklist

### Password Security
- Live password strength meter (5-level scoring)
- Common/breached password detection (client-side)
- Password history validation (last 5 passwords blocked, server-enforced)
- Account lockout after 5 failed attempts (15-minute cooldown)
- Password age tracking

### Admin Dashboard
- Platform-wide user statistics
- Active session count
- Locked account count and unlock capability
- Failed login analytics (30-day and 7-day windows)
- Recently registered users
- Full paginated audit log with event filtering
- Role management per user

### Audit Logging
- All security events persisted to MongoDB
- Events: login, failed login, logout, register, password change, reset, email verify, session revoke, role change, new device login
- IP address, browser, OS captured per event

### UX Improvements
- Skeleton loaders on all data-fetching pages
- Command palette (Ctrl+K / ⌘K) for keyboard navigation
- Toast notifications (success/error) via Sonner
- Responsive layouts
- Password expiry banner on dashboard
- Email verification banner
- Empty states on all list views

## Architecture

```
authentication-system/
  backend/
    src/
      config/         # MongoDB connection
      controllers/    # auth.controller, admin.controller
      middlewares/    # auth, role, csrf, validation, error
      models/         # User, Session, AuditLog
      routes/         # auth.routes, admin.routes
      services/       # tokenService, refreshTokenStore, emailMockService, auditLogService
      utils/          # ApiError, asyncHandler, validators, uaParser
  frontend/
    src/
      features/
        auth/pages/   # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
        dashboard/pages/ # Dashboard, Sessions, SecurityCenter, Admin, Profile, Settings
      providers/      # AppProviders (React Query + Toaster), RouterProvider
      routes/         # ProtectedRoute, RoleBasedRoute
      services/       # apiClient, authApi, csrf
      state/          # AuthContext, useAuth
      ui/
        data/         # StatCard
        feedback/     # Spinner, Skeleton, EmptyState, ErrorState
        forms/        # FormField, PasswordStrengthMeter
        layout/       # AppLayout
        nav/          # NavBar
        overlay/      # CommandPalette
      utils/          # tokenStorage, eventMeta
```

## API Endpoints

Base URL: `http://localhost:4000/api`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/login` | — | Login, sets refresh cookie |
| POST | `/auth/logout` | Bearer | Logout, revokes session |
| POST | `/auth/refresh` | Cookie | Rotate refresh token |
| GET | `/auth/me` | Bearer | Get current user |
| POST | `/auth/forgot-password` | — | Request password reset |
| POST | `/auth/reset-password` | — | Complete password reset |
| POST | `/auth/verify-email` | — | Verify email token |
| PUT | `/auth/profile` | Bearer + CSRF | Update display name |
| PUT | `/auth/change-password` | Bearer + CSRF | Change password |
| GET | `/auth/sessions` | Bearer | List active sessions |
| DELETE | `/auth/sessions/:id` | Bearer | Revoke a session |
| DELETE | `/auth/sessions` | Bearer | Revoke all sessions |
| GET | `/auth/security-insights` | Bearer | Security score + activity |

### Admin (role: admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| PATCH | `/admin/users/:id/role` | Update user role |
| PATCH | `/admin/users/:id/unlock` | Unlock locked account |
| GET | `/admin/dashboard` | Stats, recent users, audit logs |
| GET | `/admin/audit-logs` | Paginated audit log |

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally or via connection string

### Backend
```bash
cd authentication-system/backend
npm ci
cp .env.example .env
# Edit .env — set strong JWT secrets
npm run dev
```

### Frontend
```bash
cd authentication-system/frontend
npm ci
cp .env.example .env
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=mongodb://localhost:27017/authentication_system
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAMESITE=Lax
CLIENT_ORIGIN=http://localhost:5173
CSRF_SECRET=<strong-random-secret>
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=SecureID
```

## Security Notes
- Refresh tokens are stored in HttpOnly cookies (not accessible to JS)
- CSRF protection via double-submit cookie pattern on mutating endpoints
- Account lockout after 5 failed login attempts (15-minute cooldown)
- Password history prevents reuse of last 5 passwords
- All security events are audit-logged with IP and User-Agent
- JWT secrets must be set via environment variables — never hardcoded

## Known Limitations (Demo)
- Email sending is mocked — verification tokens are returned in the API response
- Refresh token store uses in-memory Map for hot-path validation (sessions persist in MongoDB across restarts, but in-memory state resets on server restart)
- No rate limiting beyond account lockout (production would add express-rate-limit)
