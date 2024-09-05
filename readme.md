
# SwiftRental

SwiftRental is a comprehensive car rental reservation system that offers a smooth and secure experience for both users and administrators. It provides functionalities for user registration, car booking, and administrative control over the car inventory and bookings.

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

### Error Handling
- Comprehensive error handling for validation, authentication, and other errors to ensure smooth user experience.

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
│   │   │   ├── customErrorHandlerFunctions
│   │   │   │   ├── mongooseCastError.ts
│   │   │   │   ├── mongooseDuplicateDataError.ts
│   │   │   │   ├── mongooseQueryError.ts
│   │   │   │   ├── mongooseValidationError.ts
│   │   │   │   ├── zodError.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   └── notFound.ts
│   │   ├── errors
│   │   │   └── AppError.ts
│   │   ├── interface
│   │   │   ├── error.ts
│   │   │   └── index.d.ts
│   │   ├── Middlewares
│   │   │   ├── auth.ts
│   │   │   └── validateRequest.ts
│   │   ├── Modules
│   │   │   ├── Auth
│   │   │   │   ├── auth.constant.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.interface.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.utils.ts
│   │   │   │   ├── auth.validation.ts
│   │   │   ├── Booking
│   │   │   │   ├── booking.controller.ts
│   │   │   │   ├── booking.interface.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   ├── booking.route.ts
│   │   │   │   ├── booking.service.ts
│   │   │   │   └── booking.validation.ts
│   │   │   ├── Car
│   │   │   │   ├── car.controller.ts
│   │   │   │   ├── car.interface.ts
│   │   │   │   ├── car.model.ts
│   │   │   │   ├── car.route.ts
│   │   │   │   ├── car.service.ts
│   │   │   │   └── car.validation.ts
│   │   │   ├── User
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.validation.ts
│   ├── routes
│   │   └── index.ts
│   ├── utils
│   │   ├── catchAsync.ts
│   │   ├── sendResponse.ts
│   │   └── app.ts
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
   PORT=6000
   DATABASE_URI=your_mongodb_uri
   HASH_SALT=12
   DEFAULT_PASS=swift123
   JWT_ACCESS_SECRET=647ce085b2f735579953875d0c76d9a69d420bb229a733ca8aa70595e709c082
   JWT_REFRESH_SECRET=284248d00cef99f7b3800789e67b3de84cd0210e8403eba08d80c2d7c49133c6
   JWT_ACCESS_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=365d
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

