# Express.js Template with MySQL and Authentication

A robust Express.js starter template with MySQL integration using Prisma ORM, featuring user authentication, email functionality, and file uploads.

## Features

- 🔐 User Authentication (JWT)
- 📧 Email Integration (Password Reset)
- 📁 File Upload Support
- 🎯 Role-Based Access Control
- 🗃️ MySQL Database with Prisma ORM
- ✅ Input Validation
- 🔄 Password Reset Flow
- 👤 User Avatar Management
- 🧪 Jest Testing Setup

## Project Structure

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
└── uploads/              # File upload directory
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Getting Started

1. Clone the repository:
   \`\`\`bash
   git clone <your-repo-url>
   cd ExpreesTemplateWithSQL
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a \`.env\` file in the root directory with the following content:
   \`\`\`env

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
\`\`\`

4. Run database migrations:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication

- \`POST /api/v1/auth/register\` - Register a new user
- \`POST /api/v1/auth/login\` - User login
- \`GET /api/v1/auth/logout\` - User logout

### Password Reset

- \`POST /api/v1/forget-password\` - Request password reset
- \`POST /api/v1/forget-password/verify-code\` - Verify reset code
- \`POST /api/v1/forget-password/reset-password\` - Set new password

### User Management

- \`GET /api/v1/users\` - Get all users (Admin only)
- \`GET /api/v1/users/:id\` - Get user by ID
- \`PUT /api/v1/users/:id\` - Update user
- \`DELETE /api/v1/users/:id\` - Delete user
- \`PATCH /api/v1/users/:id/avatar\` - Update user avatar

## Environment Variables

Here's a detailed explanation of the required environment variables:

| Variable       | Description             | Example                             |
| -------------- | ----------------------- | ----------------------------------- |
| NODE_ENV       | Application environment | development                         |
| PORT           | Server port number      | 3000                                |
| DATABASE_URL   | MySQL connection URL    | mysql://user:pass@localhost:3306/db |
| JWT_SECRET     | Secret key for JWT      | someRandomSecureString              |
| EMAIL_HOST     | SMTP server host        | smtp.gmail.com                      |
| EMAIL_PORT     | SMTP server port        | 587                                 |
| EMAIL_USER     | SMTP email address      | your@gmail.com                      |
| EMAIL_PASSWORD | SMTP app password       | 16-character-app-password           |

## Email Setup (Gmail)

To use Gmail for sending emails:

1. Enable 2-Step Verification in your Google Account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in EMAIL_PASSWORD

## Testing

Run tests using:
\`\`\`bash
npm test
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
