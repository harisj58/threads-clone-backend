import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

// dotenv allows us to use the process.env variables in our app
dotenv.config();
// instantiate an express server
const app = express();
// connect to the database
connectDB();

// set the PORT to the env variable or default to 5000
const PORT = process.env.PORT || 5000;

// To parse JSON data in the req.body
app.use(express.json());
// To parse form data in the req.body
app.use(express.urlencoded({ extended: true }));
// To parse and store cookies for session management
app.use(cookieParser());

// Routes
app.use("/api/users/", userRoutes); // user routes

// Initialize the express app to listen on PORT port
app.listen(PORT, () =>
  console.log(`Server started at port http://localhost:${PORT}...`)
);
