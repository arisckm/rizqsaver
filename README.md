# 🌿 RizqSaver — Food Rescue Platform

A full-stack SaaS platform connecting restaurants with surplus food to local charities and NGOs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (M0 Free Tier) |
| Media Storage | Cloudinary (Free Tier) |
| Auth | bcryptjs + JWT |
| Validation | Zod |
| File Upload | Multer + multer-storage-cloudinary |
| Frontend | React.js + Tailwind CSS + Zustand |

---

## Project Structure

```
rizqsaver/
├── backend/
│   ├── config/        # DB + Cloudinary setup
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth, validation, error handling
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   └── server.js      # Entry point
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── store/     # Zustand auth store
        └── lib/       # Axios instance
```

---

## Setup Instructions

### 1. MongoDB Atlas
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free M0 cluster
2. Create a database user (username/password)
3. Whitelist IP: `0.0.0.0/0` (for dev)
4. Copy your connection URI

### 2. Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) → Free account
2. Copy Cloud Name, API Key, API Secret from dashboard

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, and Cloudinary credentials
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

---

## API Routes

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register donor or receiver |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get current user |

### Listings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/listings` | Public | Get all listings (search + pagination) |
| GET | `/api/listings/:id` | Public | Single listing |
| POST | `/api/listings` | Donor (verified) | Create listing with image |
| PUT | `/api/listings/:id` | Donor (owner) | Update listing |
| DELETE | `/api/listings/:id` | Donor/Admin | Delete listing |
| GET | `/api/listings/my-listings` | Donor | Own listings |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings/:listingId` | Receiver | Claim a listing (atomic) |
| GET | `/api/bookings/my-bookings` | Receiver | My claims |
| GET | `/api/bookings/incoming` | Donor | Incoming claims |
| PATCH | `/api/bookings/:id/complete` | Donor | Mark completed |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users` | Admin | All users |
| PATCH | `/api/admin/users/:id/verify` | Admin | Verify/unverify donor |
| PATCH | `/api/admin/users/:id/toggle-active` | Admin | Activate/deactivate user |

---

## Creating an Admin Account

Register normally, then update directly in MongoDB Atlas:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## Key Design Decisions

- **Atomic claim**: Uses `findOneAndUpdate` with a status filter to prevent race conditions on simultaneous claims.
- **Verified donor gate**: Unverified donors cannot post listings — enforced at middleware level.
- **Cloudinary cleanup**: Images are deleted from Cloudinary when a listing is removed.
- **Auto-expiry index**: MongoDB TTL index on `expiresAt` auto-removes expired documents.
