

# SwiftRental

SwiftRental is a comprehensive car rental reservation system that offers a smooth and secure experience for both users and administrators. It provides functionalities for user registration, car booking, payment processing, and administrative control over the car inventory, bookings, and trip management.

## Features

### Authentication and Authorization
- **User Registration and Login**: Secure registration and login for both users and admins.
- **Role-Based Access Control**: Restricts certain actions to admin users only.

### Car Management (Admin Only)
- **Add New Cars**: Admins can add new cars to the inventory.
- **Update Car Details**: Modify details of existing cars.
- **Soft Delete Cars**: Mark cars as unavailable without removing them from the database.

### Booking Management
- **Book a Ride**: Users can book cars for specific time slots.
- **View Booking History**: Users can view their past bookings.
- **Admin Booking Oversight**: Admins can view all bookings.
- **Approve/Reject Booking Requests (Admin Only)**: Admins can approve or reject user booking requests.
- **End a Trip (Admin Only)**: Admins can end ongoing trips.

### Payment Integration
- **Stripe Payments**: Secure payment processing using Stripe.
- **Aamarpay Payments**: Alternative payment option via Aamarpay.
- **Payment Verification**: Integrated system for verifying payment transactions.

### Error Handling
- Comprehensive error handling for validation, authentication, payments, and other errors to ensure smooth user experience.

## Project Structure

```
SwiftRental
├── node_modules
├── src
│   ├── App
│   │   ├── Builder
│   │   │   └── QueryBuilder.ts
│   │   ├── configs
│   │   ├── ErrorHandler
│   │   ├── errors
│   │   ├── interface
│   │   ├── Middlewares
│   │   ├── Modules
│   │   │   ├── Auth
│   │   │   ├── Booking
│   │   │   ├── Car
│   │   │   ├── Payment
│   │   │   ├── User
│   ├── routes
│   ├── utils
│   └── server.ts
├── .env
├── .gitignore
├── .prettierrc.json
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── readme.md
└── tsconfig.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Muslehud77/SwiftRental
   cd SwiftRental
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the following configuration:

   ```env
   NODE_ENV=development
   PORT=8000
   CLIENT_URL=http://localhost:5173
   SERVER_URL=http://localhost:8000
   DATABASE_URI=your_mongodb_uri
   HASH_SALT=12
   DEFAULT_PASS=swift123
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_ACCESS_EXPIRES_IN=10d
   JWT_REFRESH_EXPIRES_IN=365d

   # Stripe Payment
   STRIPE_SECRET=your_stripe_secret_key

   # Aamarpay Payment
   AMARPAY_URL="https://sandbox.aamarpay.com"
   AMARPAY_PAYMENT_VERIFY_URL="https://sandbox.aamarpay.com/api/v1/trxcheck/request.php"
   AMARPAY_STORE_ID="your_aamarpay_store_id"
   AMARPAY_SIGNATURE_KEY="your_aamarpay_signature_key"
   ```

### Running the Application

**Development Mode:**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

## Frontend Repository

The frontend code for SwiftRental is available here: [SwiftRental Frontend Repo](https://github.com/Muslehud77/SwiftRental-client).

## Visit the Live Frontend

Click the button below to access the live frontend of SwiftRental:

[![SwiftRental Frontend](https://img.shields.io/badge/Visit-Frontend-brightgreen)](https://swiftrental.vercel.app/)

### Code Quality

- **Linting:**
  ```bash
  npm run lint
  ```

- **Auto-fix linting issues:**
  ```bash
  npm run lint:fix
  ```

- **Prettier:**
  ```bash
  npm run prettier
  npm run prettier:fix
  ```

