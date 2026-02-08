# Always Demon - Backend API

## Overview
This is the backend API server for the Always Demon e-commerce platform.

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd backend
npm install
```

### Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

#### Products (Admin only)
- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

#### Contact Settings (Admin only)
- `GET /api/settings/contact` - Get contact settings
- `PUT /api/settings/contact` - Update contact settings

#### Inquiries
- `GET /api/inquiries` - Get all inquiries (Admin only)
- `POST /api/inquiries` - Create an inquiry

### Environment Variables

Create a `.env` file:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
```

### Default Admin Credentials
- Username: demon
- Password: yashdemon
