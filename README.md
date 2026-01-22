# Stripe React API - Production-Ready Express.js Backend

A production-ready RESTful API built with Express.js, TypeScript, and Prisma ORM, featuring enterprise-level architecture, comprehensive security, and optimized performance.

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

### Database
- **Prisma ORM**: Type-safe database queries
- **PostgreSQL**: Production database
- **Migrations**: Version-controlled schema changes
- **Connection Pooling**: Optimized database connections

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
├── app.ts                   # Express app setup
└── server.ts               # Server bootstrap

prisma/
└── schema.prisma           # Database schema
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
- PostgreSQL 16+

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env.development
```

Edit `.env.development`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/stripe_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CORS_ORIGIN=http://localhost:3001
```

3. **Setup database**:
```bash
# Create database
createdb stripe_db

# Run migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate
```

4. **Start development server**:
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📝 Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
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

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Roles
- `USER` - Regular user
- `ADMIN` - Administrator
- `SUPER_ADMIN` - Super administrator

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
