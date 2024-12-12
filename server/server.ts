require("dotenv").config();
import express from "express";
import cors from "cors";
import router from "./routes/index";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middlewares/authenticateToken"; // Import the middleware

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/newest";
console.log(MONGODB_URI);

export const JWT_SECRET: string = process.env.JWT_SECRET || "my secret1";
export const CONTEST_SECRET: string = process.env.CONTEST_SECRET || "my secret2";
export const QUIZ_SECRET: string = process.env.QUIZ_SECRET || "my secret3"; // Fixed typo here

// Connect to MongoDB
mongoose.connect(MONGODB_URI);
export const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const app: express.Application = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: true,
    credentials: true,  
}));
app.use(express.json());
app.use(cookieParser());

// Use the authentication middleware globally for all /api routes
app.use("/api", authenticateToken, router);

// Start the server
app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
