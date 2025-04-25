# 🚀 Express.js Template with MySQL and Authentication

A robust, production-ready Express.js starter template with MySQL integration using Prisma ORM, featuring comprehensive user authentication, email functionality, and file upload capabilities.

## ✨ Features

- **🔐 User Authentication**

  - JWT-based secure authentication
  - Role-based authorization (User/Admin)
  - Protected routes with middleware
  - Session management with cookies

- **📧 Email Integration**

  - Gmail SMTP integration
  - Beautiful HTML email templates
  - Secure password reset workflow
  - Transactional email support

- **📁 File Management**

  - User avatar uploads
  - Secure file storage
  - Automatic file cleanup
  - Default avatar support

- **🛡️ Security**

  - Role-based access control (RBAC)
  - Input validation
  - Password hashing with bcrypt
  - Secure reset code generation

- **💾 Database**

  - MySQL with Prisma ORM
  - Automated migrations
  - Type-safe database queries
  - Efficient connection pooling

- **⚙️ Development Tools**
  - Jest testing setup
  - Environment configuration
  - API error handling
  - Standardized response format

## 📂 Project Structure

```
├── config/               # Configuration files
├── controller/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   └── forgetPasswordController.js
├── Middleware/
│   ├── authMiddleware.js    # JWT authentication
│   └── validationMiddleware.js
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/         # Database migrations
├── router/
│   ├── authRouter.js
│   ├── userRouter.js
│   └── forgetPasswordRouter.js
├── utils/
│   ├── APIError.js         # Error handling
│   ├── APIResponse.js      # Response formatting
│   └── sendMail.js        # Email utility
├── uploads/
│   └── userAvatar/        # User avatar storage
└── tests/                # Jest test files
```

## 🔧 Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/mrXrobot26/ExpreesTemplateWithSQL>
cd ExpreesTemplateWithSQL
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="mysql://username:password@localhost:3306/your_database"

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### 4. Set up the database

```bash
# Create database tables
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Your API will be available at `http://localhost:3000/api/v1`

## 📡 API Endpoints

### Authentication

| Method | Endpoint                | Description         | Auth Required |
| ------ | ----------------------- | ------------------- | ------------- |
| POST   | `/api/v1/auth/register` | Register a new user | No            |
| POST   | `/api/v1/auth/login`    | User login          | No            |

### Password Management

| Method | Endpoint                                 | Description            | Auth Required |
| ------ | ---------------------------------------- | ---------------------- | ------------- |
| POST   | `/api/v1/forget-password`                | Request password reset | No            |
| POST   | `/api/v1/forget-password/verify-code`    | Verify reset code      | No            |
| POST   | `/api/v1/forget-password/reset-password` | Set new password       | No            |

### User Management

| Method | Endpoint                   | Description        | Auth Required |
| ------ | -------------------------- | ------------------ | ------------- |
| GET    | `/api/v1/users`            | Get all users      | Admin         |
| GET    | `/api/v1/users/:id`        | Get user by ID     | Yes\*         |
| PUT    | `/api/v1/users/:id`        | Update user        | Yes\*         |
| DELETE | `/api/v1/users/:id`        | Delete user        | Yes\*         |
| PATCH  | `/api/v1/users/:id/avatar` | Update user avatar | Yes\*         |

_\* Users can only access their own resources unless they have admin privileges_

## 🔒 Authentication Flow

### Registration

1. Client sends POST request to `/api/v1/auth/register` with:

   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "securePassword123",
     "passwordConfirm": "securePassword123"
   }
   ```

2. Server validates input, hashes password, and creates user
3. Server returns JWT token and user data

### Login

1. Client sends POST request to `/api/v1/auth/login` with:

   ```json
   {
     "email": "john@example.com",
     "password": "securePassword123"
   }
   ```

2. Server validates credentials and issues JWT token
3. Token is returned in response and set as HTTP-only cookie

### Password Reset Flow

1. Request reset code:

   ```json
   POST /api/v1/forget-password
   {
     "email": "user@example.com"
   }
   ```

2. Verify reset code:

   ```json
   POST /api/v1/forget-password/verify-code
   {
     "email": "user@example.com",
     "resetCode": "123456"
   }
   ```

3. Set new password:
   ```json
   POST /api/v1/forget-password/reset-password
   {
     "email": "user@example.com",
     "newPassword": "newSecurePassword123"
   }
   ```

## 📧 Email Setup

### Using Gmail

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other" (name it "Express App")
   - Use the 16-character password in your `.env` file

### HTML Email Templates

The system includes pre-built HTML email templates for:
- Password reset codes


## 🗃️ Database Schema

### User Model

```prisma
model User {
  id                   Int       @id @default(autoincrement())
  createdAt            DateTime  @default(now())
  email                String    @unique
  name                 String?
  role                 Role      @default(USER)
  password             String
  avatar               String    @default("avatar.png")
  passwordResetCode    String?
  passwordResetExpires DateTime?
  passwordResetVerify  Boolean   @default(false)
}

enum Role {
  USER
  ADMIN
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=auth
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
