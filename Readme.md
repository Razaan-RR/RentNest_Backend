# RentNest Backend API

RentNest is a RESTful backend API for a rental property management platform. It allows tenants to browse and rent properties, landlords to manage listings, and admins to oversee the entire system.

## Features

- JWT Authentication & Authorization
- Role-based Access Control (Tenant, Landlord, Admin)
- User Profile Management
- Property CRUD Operations
- Category Management
- Rental Request Management
- Stripe Payment Integration
- Property Reviews
- Admin Dashboard APIs
- Input Validation & Global Error Handling

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Stripe
- Zod

## User Roles

### Tenant
- Register & Login
- Browse Properties
- Submit Rental Requests
- Make Payments
- Leave Reviews
- Update Profile

### Landlord
- Create Properties
- Update/Delete Properties
- Manage Rental Requests
- View Own Listings

### Admin
- View All Users
- Ban/Activate Users
- View All Properties
- View All Rental Requests

## Installation

```bash
git clone <repository-url>
cd RentNest_Backend
npm install
```

## Environment Variables

Create a `.env` file and add:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_ACCESS_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_secret
APP_URL=http://localhost:5000
```

## Run the Project

```bash
npm run dev
```

## Build

```bash
npm run build
```

## API Base URL

```
http://localhost:5000/api
```

## Author

**Razaan Reza**