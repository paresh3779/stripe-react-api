# Stripe React API - Production-Ready Express.js Backend

A production-ready RESTful API built with Express.js, TypeScript, and Prisma ORM, featuring enterprise-level architecture, comprehensive security, and complete Stripe payment integration.

## 🚀 Features

### Architecture
- **Layered Architecture**: Controller → Service → Repository → Model pattern
- **Interface-Based Design**: Dependency injection ready with IService and IRepository interfaces
- **TypeScript**: Full type safety with strict mode
- **Modular Structure**: Feature-based organization

### Security
- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **Password Security**: Bcrypt hashing with configurable rounds
- **Input Sanitization**: XSS protection on all inputs
- **SQL Injection Prevention**: Prisma parameterized queries
- **Rate Limiting**: Configurable per-endpoint limits
- **CORS**: Whitelist-based origin control
- **Helmet**: Security headers (CSP, HSTS, etc.)
- **HPP**: HTTP Parameter Pollution prevention

### Validation & Error Handling
- **DTO Validation**: class-validator decorators
- **Global Error Handler**: Centralized error processing
- **Custom Error Classes**: AppError, ValidationError, UnauthorizedError, etc.
- **Structured Logging**: Winston with file/console transports

### Database & Data Management
- **Prisma ORM**: Type-safe database queries
- **MySQL**: Production database (migrated from PostgreSQL)
- **Migrations**: Version-controlled schema changes
- **Seeders**: Pre-populated data for products, prices, coupons
- **Factories**: Test data generation with Faker.js
- **16+ Tables**: Complete Stripe ecosystem (Products, Prices, Payments, Subscriptions, Invoices, Coupons, etc.)

### Stripe Integration
- **Products Management**: One-time, subscription, and usage-based products
- **Pricing Plans**: Flexible pricing with intervals and trial periods
- **Payment Processing**: Complete payment intent and charge tracking
- **Subscriptions**: Recurring billing with trial support
- **Invoices**: Automated invoice generation and tracking
- **Coupons & Promo Codes**: Discount management system
- **Customer Management**: Stripe customer mapping and payment methods
- **Webhook Events**: Event logging and processing

## 📁 Project Structure

```
src/
├── config/                  # Configuration
│   ├── env.ts              # Environment variables
│   ├── database.ts         # Prisma client
│   ├── cors.ts             # CORS settings
│   └── logger.ts           # Winston logger
├── types/                   # TypeScript types
│   ├── express.d.ts        # Express extensions
│   └── common.types.ts     # Shared types
├── utils/                   # Utilities
│   ├── jwt.util.ts         # JWT helpers
│   ├── password.util.ts    # Password utilities
│   ├── response.util.ts    # Response formatters
│   └── error.util.ts       # Custom errors
├── dto/                     # Data Transfer Objects
│   └── auth/
│       ├── login.dto.ts
│       ├── register.dto.ts
│       └── refresh.dto.ts
├── middlewares/             # Express middlewares
│   ├── auth.middleware.ts  # JWT verification
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── sanitize.middleware.ts
├── repositories/            # Data access layer
│   ├── interfaces/
│   │   ├── IUserRepository.ts
│   │   └── ITokenRepository.ts
│   ├── user.repository.ts
│   └── token.repository.ts
├── services/                # Business logic
│   ├── interfaces/
│   │   └── IAuthService.ts
│   └── auth.service.ts
├── controllers/             # HTTP handlers
│   └── auth.controller.ts
├── routes/                  # Route definitions
│   ├── auth.routes.ts
│   └── index.ts
├── database/                # Database management
│   ├── seeders/            # Data seeders
│   │   ├── BaseSeeder.ts
│   │   ├── DatabaseSeeder.ts
│   │   ├── ProductsSeeder.ts
│   │   ├── PricesSeeder.ts
│   │   ├── CouponsSeeder.ts
│   │   └── PromoCodesSeeder.ts
│   └── factories/          # Test data factories
│       ├── BaseFactory.ts
│       ├── UserFactory.ts
│       └── index.ts
├── app.ts                   # Express app setup
└── server.ts               # Server bootstrap

prisma/
└── schema.prisma           # Database schema (16 tables)
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.x
- **Authentication**: jsonwebtoken, bcryptjs
- **Validation**: class-validator, class-transformer
- **Security**: helmet, cors, express-rate-limit, hpp, xss-clean
- **Logging**: winston, morgan

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- MySQL 8.0+ (or MariaDB 10.5+)

### Installation

> **⚠️ IMPORTANT**: Request `.env` file from project lead before starting!

1. **Clone and install**:
```bash
git clone <repository-url>
cd stripe-react-api
npm install
```

2. **Setup environment**:

**Option A: Request from Project Lead (Recommended)**
```bash
# Contact project lead for the complete .env file
# Place it in the project root
```

**Option B: Create from Template (Development Only)**
```bash
cp .env.example .env
# Edit .env with your local configuration
```

**Required `.env` configuration:**
```env
# Database (Update with your credentials)
DATABASE_URL="mysql://root@127.0.0.1:3306/stripe_react_demo"

# JWT Secrets (Generate strong random values)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# Application
PORT=3000
CORS_ORIGIN=http://localhost:3001

# Stripe (Optional - get from project lead)
STRIPE_SECRET_KEY=sk_test_your_key_here
```

3. **Setup database**:
```bash
# Create MySQL database (if not exists)
mysql -u root
CREATE DATABASE stripe_react_demo;
exit;

# Or use MySQL Workbench / phpMyAdmin

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

4. **Start development server**:
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📝 Available Scripts

### Development
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
```

### Database Management
```bash
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations (interactive)
npm run db:migrate:deploy # Deploy migrations (production)
npm run db:reset         # Reset database (WARNING: deletes all data)
npm run db:seed          # Seed database with sample data
npm run db:seed:fresh    # Reset and seed database
npm run db:studio        # Open Prisma Studio (DB GUI)
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## 🔌 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer your-access-token
```

#### Health Check
```http
GET /api/health
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "Login successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Please provide a valid email address"],
    "password": ["Password must be at least 8 characters long"]
  }
}
```

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Rate Limiting
- **Authentication endpoints**: 5 requests per 15 minutes
- **General API**: 100 requests per 15 minutes
- **Global**: Configurable via environment variables

### JWT Tokens
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- Tokens stored securely in database
- Automatic cleanup of expired tokens

## 🗄️ Database Schema

### Complete Database Structure (16 Tables)

#### **Authentication & Users**
- **users** - User accounts with firstName, lastName, email, password
- **refresh_tokens** - JWT refresh token storage
- **password_reset_tokens** - Password reset functionality

#### **Products & Pricing**
- **products** - Product catalog (one_time, subscription, usage_based)
- **prices** - Pricing plans with intervals and trials
- **coupon_products** - Product-coupon relationships

#### **Payments & Transactions**
- **payments** - Payment tracking (pending, succeeded, failed, refunded)
- **subscriptions** - Recurring subscriptions with status tracking
- **invoices** - Invoice generation and management

#### **Discounts**
- **coupons** - Discount coupons (percentage, fixed, duration-based)
- **promo_codes** - Promotional codes linked to coupons

#### **Stripe Integration**
- **stripe_customers** - Stripe customer mapping
- **stripe_payment_methods** - Saved payment methods
- **stripe_webhook_events** - Webhook event logging

### User Roles
- `USER` - Regular user
- `ADMIN` - Administrator
- `SUPER_ADMIN` - Super administrator

### Product Types
- `ONE_TIME` - Single purchase products
- `SUBSCRIPTION` - Recurring subscriptions
- `USAGE_BASED` - Pay-per-use products

### Sample Data (Seeders)
The database comes pre-seeded with:
- **5 Products**: Analytics Dashboard, Learning Platform, API Gateway, Marketing Toolkit, E-commerce Platform
- **7 Pricing Plans**: Various monthly/yearly subscriptions and one-time purchases
- **3 Coupons**: Welcome discount, Annual discount, Loyalty reward
- **3 Promo Codes**: WELCOME2024, ANNUAL50, LOYALTY15

## 🏗️ Architecture Patterns

### Layered Architecture
1. **Controller Layer**: HTTP request/response handling
2. **Service Layer**: Business logic and validation
3. **Repository Layer**: Data access and queries
4. **Model Layer**: Database entities (Prisma)

### Interface Pattern
All services and repositories implement interfaces for:
- Dependency injection
- Testing (mock implementations)
- Loose coupling
- SOLID principles

### Error Handling Flow
```
Request → Middleware → Controller → Service → Repository
                ↓           ↓          ↓          ↓
         Error Handler ← Custom Errors ← Prisma Errors
                ↓
         Response (JSON)
```

## 🧪 Development Tips

### Adding New Features
1. Create interface in `services/interfaces/`
2. Implement service in `services/`
3. Create repository interface and implementation
4. Create controller with endpoints
5. Define routes with validation
6. Add DTOs for request/response

### Database Changes
```bash
# Modify prisma/schema.prisma
# Then run:
npm run prisma:migrate
npm run prisma:generate
```

### Testing Endpoints
Use tools like:
- **Postman** - API testing
- **Insomnia** - REST client  
- **curl** - Command line
- **Prisma Studio** - Database GUI

## 🐛 Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `422` - Validation Error
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## 📈 Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=strong-random-secret-key-here
JWT_REFRESH_SECRET=strong-random-refresh-key-here
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
```

### Build & Start
```bash
npm run build
npm start
```

### Database Migration
```bash
npx prisma migrate deploy
```

## 🎯 Production Checklist

- ✅ TypeScript strict mode enabled
- ✅ Environment variables configured
- ✅ Database migrations ready
- ✅ Security middleware configured
- ✅ Rate limiting implemented
- ✅ Input validation & sanitization
- ✅ Error handling & logging
- ✅ CORS configured
- ✅ JWT authentication working
- ✅ Graceful shutdown handling
- ✅ **Production build tested (Zero errors)**

## 📄 License

MIT

---

**Built with ❤️ using modern Node.js best practices**
