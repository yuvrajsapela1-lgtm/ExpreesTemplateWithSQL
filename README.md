# Express.js Template with SQL (Prisma)

A robust Express.js template project with SQL database integration using Prisma ORM, featuring user authentication, role-based authorization, and file upload capabilities.

## Features

- 🔐 User Authentication with JWT
- 👥 Role-based Authorization (Admin/User)
- 📦 Prisma ORM for database management
- 🖼️ File Upload support for user avatars
- ✨ Async error handling
- 🧪 Jest testing setup
- 🔒 Secure password hashing with bcrypt

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd ExpreesTemplateWithSQL
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="90d"
```

4. Set up the database:

```bash
npx prisma migrate dev
```

## Project Structure

```
├── config/           # Configuration files
├── controller/       # Route controllers
│   ├── authController.js
│   └── userController.js
├── Middleware/       # Custom middleware
│   └── authMiddleware.js
├── prisma/          # Prisma schema and migrations
├── router/          # Route definitions
│   ├── authRouter.js
│   └── userRouter.js
├── tests/           # Test files
├── uploads/         # File upload directory
└── server.js        # Application entry point
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user

### User Management (Protected Routes)

- `GET /api/v1/user` - Get all users
- `GET /api/v1/user/:id` - Get user by ID
- `POST /api/v1/user` - Create new user (Admin only)
- `PUT /api/v1/user/:id` - Update user (Admin only)
- `DELETE /api/v1/user/:id` - Delete user (Admin only)

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Run tests:

```bash
npm test
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- File upload filtering
- Async error handling

## File Upload

The application supports avatar image uploads for users:

- Supported formats: Images only (JPEG, PNG, etc.)
- Files are stored in: `/uploads/userAvatar/`
- Default avatar: `avatar.png`

## Error Handling

The application includes comprehensive error handling:

- Async/await error wrapper
- Custom error responses
- Validation error handling
- File upload error handling

## Testing

Tests are written using Jest and Supertest:

- User management tests
- Authentication tests
- File upload tests
- Role-based access control tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
