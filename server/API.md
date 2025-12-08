# Public Infrastructure Issue Reporting API

API for reporting and managing public infrastructure issues with role-based access (citizen, staff, admin) and optional Stripe payments for boosts/subscriptions.

## Environment
- `MONGODB_URI` Mongo connection string (required)
- Firebase admin: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- Stripe: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` (payments disabled when missing)
- `ALLOWED_ORIGINS` comma-separated CORS origins
- `PORT` (default `5000`), `APP_NAME` (optional service name)

## Auth
- Send `Authorization: Bearer <Firebase ID token>`.
- Token is verified with Firebase Admin; user records are created/updated automatically.
- Blocked users receive `403 Account is blocked`.
- Role guard middleware: `admin` routes require admin role; `staff` routes require staff role.

## Models (high level)
- User: `firebaseUid`, `email`, `name`, `photoUrl`, `phone`, `role` (`admin|staff|citizen`), `premium` (bool), `blocked` (bool), `subscription` {`isActive`, `lastPaymentId`, `startedAt`}.
- Issue: `title`, `description`, `category`, `status` (`pending|in-progress|working|resolved|closed|rejected`), `priority` (`normal|high`), `location`, `imageUrl`, `upvotes[]`, `createdBy`, `assignedStaff`, `isBoosted`, `timeline[]` ({`status`, `message`, `updatedByRole`, `updatedBy`, `createdAt`}).
- Payment: `user`, `issue?`, `type` (`boost|subscription`), `amount`, `currency` (`bdt`), `stripePaymentIntentId`, `stripeChargeId`, `status` (`pending|succeeded|failed`), `metadata`.

## Common responses
- Success: JSON payload per route.
- Errors: `{ "message": "<reason>" }` with HTTP 4xx/5xx.

## General
- `GET /` → `{ status: "ok", service: "<APP_NAME|default>" }`.
- `GET /health` → same as `/`.

## Issues (citizens, auth required)
- `POST /issues` – create issue. Body: `title`*, `description`*, `category?`, `location?`, `imageUrl?`. Non-premium users limited to 3 issues; blocked users forbidden. Timeline seeded with `pending`.
- `GET /issues` – list with pagination. Query: `page` (default 1), `limit` (max 50), `q` (search title/description/location), `category`, `status` (`pending|in-progress|working|resolved|closed|rejected`), `priority` (`normal|high`), `mine=true` to filter by requester. Sorted by `isBoosted`, `priority`, `createdAt`.
- `GET /issues/:id` – fetch single issue with `createdBy`, `assignedStaff`, and timeline user info populated.
- `PATCH /issues/:id` – owner-only, only while `status=pending`. Updatable fields: `title`, `description`, `category`, `location`, `imageUrl`. Appends timeline entry.
- `DELETE /issues/:id` – owner-only delete when found.
- `POST /issues/:id/upvote` – any authenticated user except the owner; one upvote per user. Response: `{ upvotes: <count> }`.

## Admin (auth + admin role)
- `POST /admin/issues/:id/assign-staff` – body: `staffId` (must be staff). Only when no staff assigned; keeps status unchanged. Adds timeline note.
- `POST /admin/issues/:id/reject` – only if issue is `pending`; sets status to `rejected` and logs timeline.
- `POST /admin/users/:id/block` / `POST /admin/users/:id/unblock` – toggle `blocked`.
- `GET /admin/staff` – list staff users (sorted newest first).
- `POST /admin/staff` – create staff in Firebase + DB. Body: `email`*, `password`* (min 6), `name?`, `phone?`, `photoUrl?`. Errors if email exists or Firebase fails.
- `PATCH /admin/staff/:id` – update staff; syncs changes to Firebase first (name, email, photoUrl, password). Body accepts `name`, `email`, `phone`, `photoUrl`, `password`.
- `DELETE /admin/staff/:id` – delete staff; unassigns their issues (adds timeline entry) and deletes Firebase user (ignores not-found); removes DB record.

## Staff (auth + staff role)
- `GET /staff/issues` – list issues assigned to the staff member; sorted boosted/high priority first.
- `POST /staff/issues/:id/status` – change status following allowed transitions: `pending → in-progress → working → resolved → closed`; `rejected`/`closed` have no next steps. Body: `status`. Only for issues assigned to requester. Adds timeline entry.

## Payments (Stripe, auth required)
- Amounts (BDT): boost `100`, subscription `1000`. Currency `bdt`; Stripe minor units used internally.
- `POST /payments/boost-intent` – body: `issueId`. Owner-only; issue must not already be boosted or high priority. Creates `Payment` record and Stripe PaymentIntent. Response: `{ clientSecret, paymentIntentId }`.
- `POST /payments/boost/confirm` – body: `paymentIntentId`. Verifies Stripe intent is `succeeded`, marks payment `succeeded`, updates issue to `priority=high` and `isBoosted=true`, and logs timeline.
- `POST /payments/subscription-intent` – for non-premium users only. Creates subscription Payment + Stripe intent. Response: `{ clientSecret, paymentIntentId }`.
- `POST /payments/subscription/confirm` – body: `paymentIntentId`. Verifies Stripe intent is `succeeded`, activates user `premium` + `subscription` info, marks payment `succeeded`.
- `GET /payments` – admin-only list of payments with user and issue populated, sorted newest first.

## Business rules & notes
- Free users can create up to 3 issues; subscribe to lift the cap.
- Boost elevates issue priority and pinning order; requires successful Stripe payment.
- CORS: requests allowed only from origins listed in `ALLOWED_ORIGINS` (or any origin when unset).
- Timeline entries capture status/message plus actor role/id for auditing.
