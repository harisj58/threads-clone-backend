import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

// dotenv allows us to use the process.env variables in our app
dotenv.config();
// instantiate an express server
const app = express();
// connect to the database
connectDB();

// Cross-Origin Resource Sharing (CORS) is an HTTP-header based
// mechanism that allows a server to indicate any origins (domain, scheme,
// or port) other than its own from which a browser should permit loading
// of resources. CORS also relies on a mechanism by which browsers make a
// "preflight" request to the server hosting the cross-origin resource,
// in order to check that the server will permit the actual request.
// In that preflight, the browser sends headers that indicate the HTTP
// method and headers that will be used in the actual request.
app.use(cors());
app.options("*", cors({ origin: true, credentials: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// set the PORT to the env variable or default to 5000
const PORT = process.env.PORT || 5000;

// configure cloudinary with process environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// To parse JSON data in the req.body
app.use(express.json({ limit: "50mb" }));
// To parse form data in the req.body
app.use(express.urlencoded({ extended: true }));
// To parse and store cookies for session management
app.use(cookieParser());

// Routes
app.use("/api/users/", userRoutes); // user routes
app.use("/api/posts/", postRoutes);

// Initialize the express app to listen on PORT port
app.listen(PORT, () =>
  console.log(`Server started at port http://localhost:${PORT}...`)
);
