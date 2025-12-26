# E-Commerce System API

A complete e-commerce backend system built with Node.js, TypeScript, Express, and MongoDB.

## Features

### Seller Features
- Registration and login with JWT authentication
- Password encryption using bcrypt
- Account lockout after 10 failed login attempts
- Brand management (create, list with filters)
- Product management (create, list with filters)
- Coupon management (create, list with filters)

### User Features
- Registration with 100 wallet points bonus
- Login with JWT authentication
- Shopping cart management
- Order placement with discount calculation
- Wallet points and coupon redemption
- Payment handling (success/failure)

### System Features
- Automatic stock management
- Auto-deactivate products when out of stock
- Transaction-based operations for data consistency
- Comprehensive validation using Joi
- Error handling middleware
- Pagination support
- Bulk operations for performance optimization

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Password Hashing:** bcrypt
- **Development:** nodemon, ts-node

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables in .env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## API Endpoints

### Seller Endpoints

#### Authentication
```
POST /api/sellers/register
POST /api/sellers/login
```

#### Brands (Requires Auth)
```
POST   /api/brands              - Create brand
GET    /api/brands              - List brands (filters: search, isActive, page, limit, sortBy, sortOrder)
GET    /api/brands/:id          - Get brand by ID
```

#### Products (Requires Auth)
```
POST   /api/products            - Create product
GET    /api/products            - List products (filters: search, category, brandId, minPrice, maxPrice, inStock, isActive, page, limit, sortBy, sortOrder)
GET    /api/products/:id        - Get product by ID
```

#### Coupons (Requires Auth)
```
POST   /api/coupons             - Create coupon
GET    /api/coupons             - List coupons (filters: search, discountType, isActive, validOnly, page, limit, sortBy, sortOrder)
GET    /api/coupons/:id         - Get coupon by ID
```

### User Endpoints

#### Authentication
```
POST /api/users/register
POST /api/users/login
```

#### Cart (Requires Auth)
```
POST   /api/cart                - Add item to cart
GET    /api/cart                - Get cart
POST   /api/cart/calculate      - Calculate total with discounts
```

#### Orders (Requires Auth)
```
POST   /api/orders              - Place order
PATCH  /api/orders/:id/payment  - Handle payment status
```

## Request/Response Examples

### Seller Registration
```json
POST /api/sellers/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product
```json
POST /api/products
Headers: { "Authorization": "Bearer <token>" }
{
  "name": "Air Max 90",
  "description": "Classic sneaker",
  "price": 120,
  "stock": 50,
  "category": "Footwear",
  "brandId": "65f1234567890abcdef12345"
}
```

### Create Coupon
```json
POST /api/coupons
Headers: { "Authorization": "Bearer <token>" }
{
  "code": "SUMMER2024",
  "discountType": "percentage",
  "discountValue": 20,
  "minPurchase": 100,
  "maxDiscount": 50,
  "validFrom": "2024-06-01T00:00:00Z",
  "validUntil": "2024-08-31T23:59:59Z",
  "usageLimit": 1000
}
```

### User Registration
```json
POST /api/users/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

### Add to Cart
```json
POST /api/cart
Headers: { "Authorization": "Bearer <user_token>" }
{
  "productId": "65f1234567890abcdef12345",
  "quantity": 2
}
```

### Calculate Cart Total
```json
POST /api/cart/calculate
Headers: { "Authorization": "Bearer <user_token>" }
{
  "couponCode": "SUMMER2024",
  "useWalletPoints": 50
}
```

### Place Order
```json
POST /api/orders
Headers: { "Authorization": "Bearer <user_token>" }
{
  "couponCode": "SUMMER2024",
  "useWalletPoints": 50
}
```

### Handle Payment
```json
PATCH /api/orders/:id/payment
Headers: { "Authorization": "Bearer <user_token>" }
{
  "paymentStatus": "success"
}
```

## Database Models

### Seller
- name, email, password (hashed)
- loginAttempts, lastLoginAttempt, lockUntil
- timestamps

### User
- name, email, password (hashed)
- walletPoints (default: 100)
- timestamps

### Brand
- name, description, website
- sellerId (ref: Seller)
- isActive
- timestamps

### Product
- name, description, price, stock, category
- brandId (ref: Brand) - required
- sellerId (ref: Seller)
- isActive
- timestamps

### Coupon
- code, discountType (percentage/fixed), discountValue
- minPurchase, maxDiscount, validFrom, validUntil
- usageLimit, usedCount
- sellerId (ref: Seller)
- isActive
- timestamps

### Cart
- userId (ref: User)
- items: [{ productId, quantity }]
- timestamps

### Order
- userId (ref: User)
- items: [{ productId, quantity, price }]
- subtotal, discount, total
- couponCode, couponDiscount, walletPointsUsed
- status (pending, confirmed, shipped, delivered, cancelled)
- paymentStatus (pending, success, failed)
- timestamps

## Business Logic

### Order Flow
1. User adds products to cart
2. User calculates total with optional coupon and wallet points
3. User places order (cart cleared, coupon/wallet deducted)
4. Payment processed:
   - **Success:** Stock deducted, product auto-deactivated if stock = 0
   - **Failed:** Wallet points and coupon usage refunded

### Stock Management
- Stock validated during cart addition and order placement
- Stock deducted only on successful payment
- Products auto-deactivated when stock reaches 0
- Bulk operations used for performance

### Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT authentication for protected routes
- Account lockout after 10 failed login attempts (5 min)
- Input validation using Joi schemas
- MongoDB transactions for data consistency

## Performance Optimizations
- Database indexes on frequently queried fields
- Compound indexes for common query patterns
- Bulk write operations for multi-item updates
- Pagination support for list endpoints
- Transaction-based operations

## Error Handling
- Custom error classes (ApiError, NotFoundError, etc.)
- Global error handler middleware
- Validation error responses
- Transaction rollback on failures

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure
```
src/
├── config/          # Configuration files
├── middlewares/     # Express middlewares
├── modules/         # Feature modules
│   ├── seller/
│   ├── user/
│   ├── brand/
│   ├── product/
│   ├── coupon/
│   ├── cart/
│   └── order/
├── routes/          # Route definitions
├── types/           # TypeScript types
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## License
ISC
