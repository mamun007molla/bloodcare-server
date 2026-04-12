# BloodCare — Backend API

REST API for the BloodCare blood donation platform. Built with Express.js and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB Atlas
- **Auth**: Firebase Admin (JWT verification)
- **Payments**: Stripe Checkout
- **Deployment**: Vercel

## Folder Structure

```
server/
├── index.js              # Entry point
├── config/
│   ├── db.js             # MongoDB connection
│   └── firebase.js       # Firebase Admin init
├── middleware/
│   ├── verifyToken.js    # JWT auth guard
│   └── errorHandler.js   # Centralized error handling
├── routes/
│   ├── userRoutes.js
│   ├── requestRoutes.js
│   ├── donorRoutes.js
│   ├── paymentRoutes.js
│   └── contactRoutes.js
└── controllers/
    ├── userController.js
    ├── requestController.js
    ├── donorController.js
    ├── paymentController.js
    └── contactController.js
```

## Setup

```bash
# Install dependencies
npm install

# Create .env from example
cp .env.example .env
# Fill in your credentials

# Run in development
npm run dev

# Run in production
npm start
```

## Environment Variables

| Variable          | Description                                |
|-------------------|--------------------------------------------|
| `PORT`            | Server port (default: 5000)                |
| `NODE_ENV`        | `development` or `production`              |
| `DB_USER`         | MongoDB Atlas username                     |
| `DB_PASS`         | MongoDB Atlas password                     |
| `FB_KEY`          | Base64-encoded Firebase service account    |
| `STRIPE_SECRET_KEY` | Stripe secret key                        |
| `SITE_DOMAIN`     | Frontend URL for Stripe redirect           |

## API Reference

### Auth
All protected routes require: `Authorization: Bearer <firebase_id_token>`

### Users
| Method | Endpoint                       | Auth | Description           |
|--------|--------------------------------|------|-----------------------|
| POST   | `/users`                       | No   | Register new user     |
| GET    | `/users`                       | Yes  | Get all users (admin) |
| GET    | `/users/role/:email`           | No   | Get user by email     |
| PATCH  | `/users/update/:id`            | No   | Update by MongoDB _id |
| PATCH  | `/users/update-by-email/:email`| No   | Update by email       |

### Blood Requests
| Method | Endpoint                        | Auth | Description              |
|--------|---------------------------------|------|--------------------------|
| POST   | `/requests`                     | Yes  | Create donation request  |
| GET    | `/requests`                     | No   | All requests (paginated) |
| GET    | `/requests/pending`             | No   | Pending requests only    |
| GET    | `/requests/user/:email`         | No   | User's own requests      |
| GET    | `/requests/:id`                 | No   | Single request           |
| PATCH  | `/requests/update-status/:id`   | No   | Update status            |
| PATCH  | `/requests/:id`                 | No   | Update full request      |
| DELETE | `/requests/:id`                 | No   | Delete request           |

### Donors
| Method | Endpoint  | Auth | Description                        |
|--------|-----------|------|------------------------------------|
| GET    | `/donors` | No   | Search: `?bloodGroup=&district=&upazila=` |

### Payments
| Method | Endpoint                      | Auth | Description             |
|--------|-------------------------------|------|-------------------------|
| POST   | `/create-payment-checkout`    | No   | Create Stripe session   |
| POST   | `/payment-success`            | No   | Record payment after redirect |
| GET    | `/payments`                   | Yes  | All payments (admin)    |

### Contact
| Method | Endpoint   | Auth | Description                   |
|--------|------------|------|-------------------------------|
| POST   | `/contact` | No   | Submit contact message        |
| GET    | `/contact` | Yes  | All messages (admin)          |

### Dashboard
| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| GET    | `/dashboard/stats` | Yes  | Stats for overview |

## Demo Credentials

**User**
- Email: `user@bloodcare.com`
- Password: `User@1234`

**Admin**
- Email: `admin@bloodcare.com`
- Password: `Admin@1234`

## Deployment (Vercel)

```bash
# Add env variables in Vercel dashboard, then:
vercel --prod
```

`vercel.json` is already configured.
