
# Threads Clone Backend

  

A robust Node.js backend API for a Threads-like social media application, built with Express.js and MongoDB. This backend handles user authentication, post management, social interactions, and media uploads.

  

## 🚀 Features

  

### User Management

-  **User Registration & Authentication** - Secure signup/login with JWT tokens

-  **Profile Management** - Update user profiles with bio, profile pictures, and personal information

-  **Follow/Unfollow System** - Build social connections between users

-  **Protected Routes** - Middleware-based authentication for secure endpoints

  

### Post Management

-  **Create Posts** - Text posts with optional image uploads

-  **Delete Posts** - Users can remove their own posts

-  **Like/Unlike Posts** - Interactive engagement system

-  **Reply to Posts** - Threaded conversation support

-  **User Feed** - Personalized feed based on followed users

-  **User Posts** - View all posts from a specific user

  

### Media Handling

-  **Image Uploads** - Cloudinary integration for secure image storage

-  **Profile Pictures** - Support for user profile image uploads

  

## 🛠️ Tech Stack

  

-  **Runtime**: Node.js

-  **Framework**: Express.js

-  **Database**: MongoDB with Mongoose ODM

-  **Authentication**: JWT (JSON Web Tokens)

-  **Password Hashing**: bcryptjs

-  **File Storage**: Cloudinary

-  **CORS**: Cross-origin resource sharing enabled

-  **Environment Management**: dotenv

  

## 📁 Project Structure

  

```
threads-clone-backend/
├── controllers/ # Business logic for handling requests
│ ├── userController.js # User-related operations
│ └── postController.js # Post-related operations
├── db/ # Database configuration
│ └── connectDB.js # MongoDB connection setup
├── middleware/ # Custom middleware functions
│ └── protectRoute.js # Authentication middleware
├── models/ # MongoDB schemas
│ ├── userModel.js # User data model
│ └── postModel.js # Post data model
├── routes/ # API route definitions
│ ├── userRoutes.js # User endpoints
│ └── postRoutes.js # Post endpoints
├── utils/ # Helper functions and utilities
├── server.js # Main application entry point
└── package.json # Dependencies and scripts
```

  

## 🔧 Installation & Setup

  

### Prerequisites

- Node.js (v14 or higher)

- MongoDB (local or Atlas)

- Cloudinary account (for image uploads)

  

### Installation Steps

  

1.  **Clone the repository**

```bash
git clone <repository-url>

cd threads-clone-backend
```

  

2.  **Install dependencies**

```bash
npm install
```

  

3.  **Environment Setup**

Create a `.env` file in the root directory and add:

```env
PORT=5000
CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

  

4.  **Start the development server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

  

## 📚 API Endpoints

  

### User Routes (`/api/users/`)

  

| Method | Endpoint          | Description                        | Auth Required |
| ------ | ----------------- | ---------------------------------- | ------------- |
| POST   | `/signup`         | Register a new user                | ❌             |
| POST   | `/login`          | User login                         | ❌             |
| POST   | `/logout`         | User logout                        | ❌             |
| GET    | `/profile/:query` | Get user profile by username or ID | ❌             |
| POST   | `/follow/:id`     | Follow/unfollow a user             | ✅             |
| PUT    | `/update/:id`     | Update user profile                | ✅             |

  

### Post Routes (`/api/posts/`)

  

| Method | Endpoint          | Description                | Auth Required |
| ------ | ----------------- | -------------------------- | ------------- |
| GET    | `/feed`           | Get personalized user feed | ✅             |
| GET    | `/:id`            | Get specific post by ID    | ❌             |
| GET    | `/user/:username` | Get all posts by username  | ❌             |
| POST   | `/create`         | Create a new post          | ✅             |
| DELETE | `/:id`            | Delete a post              | ✅             |
| PUT    | `/like/:id`       | Like/unlike a post         | ✅             |
| PUT    | `/reply/:id`      | Reply to a post            | ✅             |


  

## 🗄️ Data Models

  

### User Model

```javascript
{
	name: String (required),
	username: String (required, unique),
	email: String (required, unique),
	password: String (required, min: 6),
	profilePic: String,
	followers: [String],
	following: [String],
	bio: String,
	timestamps: true
}
```

  

### Post Model

```javascript
{
	postedBy: ObjectId (ref: User, required),
	text: String (max: 500),
	img: String,
	likes: [ObjectId] (ref: User),
	replies: [{
		userId: ObjectId (ref: User, required),
		text: String (required),
		userProfilePic: String,
		username: String
	}],
	timestamps: true
}
```

  

## 🔐 Authentication

  

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token to be included in the request cookies. The `protectRoute` middleware validates tokens and adds user information to the request object.

  

## 🌐 CORS Configuration

  

The server is configured to handle Cross-Origin Resource Sharing (CORS) to allow frontend applications to communicate with the API from different domains.

  

## 🚀 Deployment

  

The application is ready for deployment on platforms like:

- Heroku

- Railway

- DigitalOcean

- AWS EC2

- Vercel (serverless functions)

  

Make sure to set all required environment variables in your deployment platform.

  

## 👨‍💻 Author

  

**Haris Javed**

  

## 📄 License

  

This project is licensed under the ISC License.

  

## 🤝 Contributing

  

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'Add amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request

  

## 📞 Support

  

If you have any questions or run into issues, please open an issue on the repository or contact the author.
