# KSIT FIND

KSIT FIND is a React/Vite application backed by a Java 21 Spring Boot API and PostgreSQL. The existing web interface remains the product UI; the backend supplies authentication, item reports/search, claims, private claim discussion, notifications, uploads, and admin workflows.

## Stack and architecture

- Frontend: React 19, TypeScript, Vite
- Backend: Java 21, Spring Boot 3, Maven, Spring Web, Spring Security, Spring Data JPA/Hibernate, Bean Validation
- Database: PostgreSQL with Flyway migrations
- Authentication: JWT bearer tokens and BCrypt password hashes
- Upload storage: configurable local filesystem storage (metadata/URLs are stored in PostgreSQL)

```text
React/Vite UI -> Spring Boot REST API -> PostgreSQL
                           |-> configured upload storage
```

## Local setup

1. Install Node.js 22, Java 21, Maven, and PostgreSQL.
2. Create a PostgreSQL database named `ksit_find`.
3. Copy `.env.example` to `.env` if you need a frontend API override. By default the app uses `http://localhost:8080/api` in a browser and `http://10.0.2.2:8080/api` in the Android Emulator. Spring Boot reads its settings from process environment variables (it does not load the Vite `.env` file).
4. In the PowerShell window used to start the backend, set:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/ksit_find"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "<your-local-postgres-password>"
$jwtBytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($jwtBytes)
$rng.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
$env:JWT_EXPIRATION_MS = "86400000"
$env:APP_STORAGE_ROOT_DIR = "./uploads"
$env:APP_CORS_ALLOWED_ORIGINS = "http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:4173,https://localhost,http://localhost,capacitor://localhost"
```

5. Start the backend; Flyway applies the schema migrations at startup:

```powershell
Set-Location backend
mvn spring-boot:run
```

6. In another PowerShell window, start the frontend:

```powershell
npm install
npm run dev
```

### Android Emulator

Install Android Studio and its Android SDK, then from the project root run:

```powershell
npm run build
npx cap sync android
Set-Location android
.\gradlew.bat assembleDebug
```

The packaged Capacitor app uses `http://10.0.2.2:8080/api` to reach the host computer's Spring Boot server. Debug builds allow cleartext and mixed-scheme WebView requests for this local-development HTTP API; release builds do not relax WebView mixed-content security, so configure HTTPS before producing a release. The backend CORS allow-list includes the Capacitor WebView origins used in development. To override the API root, set `VITE_API_BASE_URL` before building (it must include `/api`).

For local demo accounts and sample reports only, start the backend with the `demo` profile (`mvn spring-boot:run "-Dspring-boot.run.profiles=demo"`). The demo profile seeds:

- Admin: `admin@ksit.edu.in` / `Admin@123`
- Student: `rahul.kumar@ksit.edu.in` / `Password123`
- Staff: `sneha.nair@ksit.edu.in` / `Password123`

Do not use these demo credentials outside a local development database. Without the demo profile, users create accounts through the registration link on the login screen. New accounts are `STUDENT`; role assignment is restricted to admin APIs.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USERNAME`, `DB_PASSWORD` | Database credentials |
| `JWT_SECRET` | Required signing secret (minimum 32 bytes) |
| `JWT_EXPIRATION_MS` | Token lifetime in milliseconds |
| `APP_STORAGE_ROOT_DIR` | Filesystem directory for uploaded images |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins |
| `VITE_API_BASE_URL` | Optional frontend API root override (include `/api`); defaults per platform |

Never commit a real `.env` file or production secrets. Uploaded image files are stored outside PostgreSQL; item/profile records retain their URLs.

## API surface

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/users/me`, `PUT /api/users/me`
- `GET /api/items` (keyword/type/category/location/status/date filters, pagination, sorting), `GET /api/items/mine`, `GET /api/items/{id}`, `POST /api/items`, `PUT /api/items/{id}`, `DELETE /api/items/{id}`, `POST /api/items/{id}/reports`. Reports persist optional brand and color alongside their description and images; listing reports are audited and notify administrators.
- `POST /api/files` (authenticated image upload); `/files/{filename}` serves stored media
- `POST /api/items/{id}/claims`, `GET /api/claims/my`, `GET /api/claims/{id}`, `PUT /api/claims/{id}?status=...`
- `GET/POST /api/claims/{id}/messages` (claim participants and authorized staff only)
- `POST /api/claims/{id}/handover` (staff/admin only)
- `GET /api/notifications`, `GET /api/notifications/unread-count`, `PUT /api/notifications/{id}/read`, `PUT /api/notifications/read-all`
- Admin-only `/api/admin/stats`, `/users`, `/users/{id}/role`, `/items`, `/items/{id}/status`, `/claims`, `/audit-logs`

The security rules are enforced in Spring Security and service ownership checks, not by frontend visibility.

## Validation

```powershell
npm exec -- tsc --noEmit
npm run build
Set-Location backend
mvn test
```
