# Mini Transaction Ledger

A full-stack mini banking ledger where users can create accounts, record
debit/credit entries, and view an automatically computed running balance 
built as part of the Fresher Assessment: Full-Stack Mini Web Application
Challenge.

# Tech Stack
       

Technology                                   

 Frontend ---> React 18 (Vite) + Tailwind CSS Axios        
 Backend  ---> Spring Boot 3 (Java 17), Spring Data JPA      
 Database--->PostgreSQL 16                                 
 Containerization---> Docker + Docker Compose                     

# Project Structure

```
mini-transaction-ledger/
├── backend/                # Spring Boot REST API
│   ├── src/main/java/com/ledger/backend/
│   │   ├── entity/          # Account, Transaction, TransactionType
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── dto/              # Request/response objects
│   │   ├── service/          # Business logic (balance calculation)
│   │   ├── controller/       # REST endpoints
│   │   ├── exception/        # Custom exceptions + global handler
│   │   └── config/           # CORS configuration
│   ├── src/main/resources/application.yml
│   └── Dockerfile
├── frontend/                # React + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/api.js        # Axios API client
│   │   ├── components/       # AccountList, Forms, TransactionList
│   │   └── App.jsx
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

## Features

- Create ledger accounts with full KYC-style information: holder name,
  account type (Savings / Current / Business), NID number, father's &
  mother's name, and nominee details (name, relation, NID) — mirroring a
  real bank account opening form.
- The account number is generated automatically and guaranteed unique,
  shown in the UI as **A/C &lt;number&gt;**.
- A collapsible **KYC & Nominee Details** panel per account, with the NID
  numbers masked by default (only the last 4 digits shown) and a
  "Show full NID" toggle.
- Post **debit** or **credit** entries against an account.
- Automatic running balance calculation — every entry stores a snapshot
  of the balance immediately after it was applied.
- Prevents debit entries that would push the balance negative.
- Full ledger history view per account, ordered chronologically.
- Animated success/error toast notifications for every action.
- Clean, responsive UI styled in Millennium Information Solution Ltd.'s
  brand colors, built with Tailwind CSS.

## Architecture Overview

```
┌────────────────┐        REST/JSON        ┌──────────────────┐        JDBC        ┌──────────────┐
│  React Frontend │  ───────────────────▶  │  Spring Boot API │  ───────────────▶  │  PostgreSQL   │
│  (Vite + Tailwind, served by nginx)      │  (Controller →   │                    │   Database    │
│  port 3000      │  ◀───────────────────  │  Service →       │  ◀───────────────  │  port 5432    │
└────────────────┘                         │  Repository)      │                    └──────────────┘
                                            │  port 8080        │
                                           └──────────────────┘
```

The frontend never talks to the database directly — every action goes
through the backend's REST API, which enforces the ledger rules (e.g. no
overdraft) before touching the database.

# Backend request flow

1. **Controller** (`AccountController`, `TransactionController`) receives
   the HTTP request and validates the request body (`@Valid`).
2. **Service** (`AccountService`, `TransactionService`) contains the actual
   business logic — e.g. `TransactionService.recordTransaction()` computes
   the new balance, rejects the entry if it would overdraw the account, and
   saves both the updated account and the new transaction row inside a
   single `@Transactional` boundary.
3. **Repository** (Spring Data JPA) persists/reads entities from Postgres.
4. A **DTO** (`AccountResponse` / `TransactionResponse`) is returned instead
   of the raw JPA entity, so the API never leaks internal persistence
   details.
5. Errors (validation failures, not-found accounts, insufficient balance)
   are caught centrally by `GlobalExceptionHandler` and returned as a
   consistent JSON error object.

### Frontend flow

1. `App.jsx` loads all accounts on mount and auto-selects the first one.
2. `AccountList` lets the user switch between accounts; selecting one
   triggers a ledger reload for that account.
3. `CreateAccountForm` and `TransactionForm` post to the backend and then
   trigger a refresh of accounts/ledger so the UI always reflects the
   latest state from the server (the frontend holds no balance logic of
   its own — it only displays what the backend computed).
4. `TransactionList` renders the ledger table with the running balance
   column (`balanceAfter`), so the user can see how each entry affected
   the account over time.

## API Reference

| Method | Endpoint                                   | Description                          |
|--------|---------------------------------------------|---------------------------------------|
| POST   | `/api/accounts`                             | Create a new account                  |
| GET    | `/api/accounts`                             | List all accounts                     |
| GET    | `/api/accounts/{id}`                        | Get a single account                  |
| POST   | `/api/accounts/{accountId}/transactions`    | Record a debit/credit entry           |
| GET    | `/api/accounts/{accountId}/transactions`    | Get the full ledger for an account    |

**Create account** — `POST /api/accounts`
```json
{
  "accountHolderName": "Md. Alomgir",
  "accountType": "SAVINGS",
  "nid": "1234567890123",
  "fatherName": "Md. Rahman",
  "motherName": "Mst. Rahima Begum",
  "nomineeName": "Md. Karim",
  "nomineeNid": "9876543210987",
  "nomineeRelation": "Brother"
}
```
`accountType` must be one of `SAVINGS`, `CURRENT`, `BUSINESS`. `nid` and
`nomineeNid` must each be a valid 10, 13, or 17 digit NID number, and each
NID may only be used to open one account. The `accountNumber` is generated
by the backend (e.g. `SAV-2026-483920`) and returned in the response — the
client never supplies it.

**Post a transaction** — `POST /api/accounts/1/transactions`
```json
{
  "type": "CREDIT",
  "amount": 5000.00,
  "description": "Initial deposit"
}
```

## Running the Application

### Option 1 — Docker Compose (recommended)

Requires only Docker and Docker Compose installed.

```bash
# From the project root
cp .env.example .env      # optional — defaults already work
docker-compose up --build
```

Once all three containers are up:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432

To stop:
```bash
docker-compose down          # stop containers
docker-compose down -v       # stop containers AND remove the database volume
```

### Option 2 — Run locally without Docker

**Backend**
```bash
cd backend
# Make sure a local PostgreSQL instance is running and matches application.yml,
# or export DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD to point elsewhere.
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
The dev server runs on http://localhost:5173 and talks to the backend at
http://localhost:8080/api by default.

## Design Decisions

- **Auto-generated, unique account numbers** — the client only picks a
  holder name and account type; the backend generates a number like
  `SAV-2026-483920` (type prefix + year + random digits) and retries on
  the rare chance of a collision before saving, so numbers are always
  unique and the account creation flow mirrors a real bank's onboarding.
- **Running balance stored per transaction (`balanceAfter`)** instead of
  recalculating from scratch on every read — this keeps ledger reads fast
  and mirrors how real bank statements show a balance next to every entry.
- **DTOs instead of exposing entities directly** — keeps the API contract
  stable even if the database schema changes internally.
- **`ddl-auto: update`** is used so the schema is created automatically on
  first run, which is appropriate for this assessment; a production system
  would use versioned migrations (Flyway/Liquibase) instead.
- **Multi-stage Dockerfiles** for both services — the final images only
  contain the compiled JAR / static files, not the build toolchain, keeping
  images small.

## Author's Note

This project was built and tested independently to satisfy the Mini
Transaction Ledger assessment brief, including account creation, debit/credit
entries with running balance computation, a Spring Boot + React stack, and
full Dockerization with PostgreSQL.
