# Luminary — React Auth Module

A production-ready authentication frontend built with **React 18**, **Vite**, **Axios**, and **Tailwind CSS**.  
Uses **HTTP-only cookies** for session management — no `localStorage`, no Bearer tokens.

---

## Project Structure

```
auth-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── api.js                    # ← ALL API calls live here (Axios instance + endpoints)
│   ├── main.jsx
│   ├── App.jsx                   # Router + route guards
│   ├── index.css                 # Tailwind directives + global styles
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state (user, isAuthenticated, login, logout)
│   ├── hooks/
│   │   └── useFormValidation.js  # Reusable form validation hook
│   ├── components/
│   │   ├── Navbar.jsx            # Auth-aware top navigation
│   │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users → /login
│   │   ├── GuestRoute.jsx        # Redirects authenticated users → /dashboard
│   │   ├── ErrorBoundary.jsx     # React error boundary
│   │   ├── LoadingScreen.jsx     # Full-screen loading spinner
│   │   └── FormField.jsx         # FormField, PasswordInput, Spinner components
│   └── pages/
│       ├── HomePage.jsx          # Landing page (/)
│       ├── LoginPage.jsx         # /login
│       ├── RegisterPage.jsx      # /register
│       ├── ForgotPasswordPage.jsx# /forgot-password
│       ├── ResetPasswordPage.jsx # /reset-password/:token
│       ├── DashboardPage.jsx     # /dashboard (protected)
│       └── NotFoundPage.jsx      # 404
├── index.html
├── vite.config.js                # Dev proxy → http://localhost:5000
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Quick Start

### 1. Install dependencies

```bash
cd auth-app
npm install
```

### 2. Configure your backend URL

The dev server proxies `/api` → `http://localhost:5000` (see `vite.config.js`).  
Update the `target` if your backend runs on a different port:

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT',
    changeOrigin: true,
  },
},
```

### 3. Run the dev server

```bash
npm run dev
```

App runs at **http://localhost:5173**

### 4. Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## API Endpoints (consumed by `src/api.js`)

| Method | Path | Body | Notes |
|--------|------|------|-------|
| `POST` | `/api/auth/register` | `{ name, email, passwordHash }` | Creates account |
| `POST` | `/api/auth/login` | `{ email, password }` | Sets HTTP-only cookie |
| `POST` | `/api/auth/logout` | — | Clears session cookie |
| `POST` | `/api/auth/forgot-password` | `{ email }` | Sends reset email |
| `POST` | `/api/auth/reset-password/:token` | `{ password }` | Resets password |
| `GET`  | `/api/auth/me` | — | Returns current user (used on app load) |

> **Note:** The `GET /api/auth/me` endpoint is called on every page load to rehydrate auth state from the cookie. Implement this on your backend — it should return `{ user: { id, name, email } }` when authenticated, or a `401` when not.

---

## Cookie Requirements (Backend)

For cookies to work correctly across the proxy, your backend must:

```js
// Express example
res.cookie('session', token, {
  httpOnly: true,       // not accessible via JS
  secure: true,         // HTTPS only in production
  sameSite: 'lax',      // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})

// CORS must allow credentials from your frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,    // required for cookies
}))
```

---

## Features

- **Cookie-only auth** — `withCredentials: true` on every Axios request
- **AuthContext** — global `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`
- **Route guards** — `ProtectedRoute` and `GuestRoute` wrappers
- **Form validation** — required, email format, min-length, password match
- **Password strength meter** — visual indicator on register page
- **Password visibility toggle** — on all password fields
- **Toast notifications** — via `react-hot-toast`
- **Error boundary** — catches render errors gracefully
- **Loading states** — buttons disable + show spinner during requests
- **Responsive** — mobile-first, works at all screen sizes
- **Accessible** — ARIA labels, `role="alert"` on errors, semantic HTML
- **Elegant design** — Playfair Display + DM Sans, cream/ink palette, subtle animations

---

## Customisation

### Change the brand name
Search and replace `Luminary` across the codebase.

### Add more protected routes
Wrap any `<Route>` element with `<ProtectedRoute>`:
```jsx
<Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
```

### Add more API calls
All API calls go in `src/api.js`. The Axios instance handles cookies automatically:
```js
export const updateProfile = (data) => api.put('/user/profile', data)
```

### Change the backend base URL in production
Set the `VITE_API_BASE` environment variable or update `baseURL` in `src/api.js`.
