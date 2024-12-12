import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CommunityModel, UserModel } from "../models/user";
import { generateWallet, signup } from "./signup";
import { login } from "./login";
import { UnverifiedUserModel } from "../models/unverifiedUser"; // Import your UnverifiedUser model
import { findContest } from "../controllers/findContest";
import { registerContest } from "../controllers/registerContest";
import { CONTEST_SECRET, JWT_SECRET } from "../server";
import { submitProblems } from "../controllers/submitProblems";
import { pollContest } from "../utils/mongoPolling";
import { getProducts } from "./product";
import { populateQuiz } from "../middlewares/populateQuiz"; // Import the middleware
import { authenticateToken } from "../middlewares/authenticateToken"; // Import the authentication middleware
import { quizModel } from "../models/quiz"; // Import the quiz model
import { registerQuiz } from "../controllers/registerQuiz";

require("dotenv");

const user = express.Router();

// Signup Route
user.post("/signup", async (req, res) => {
    signup(req, res, "U");
});

user.get("/product/list", getProducts);

// Unverified Signup Route
user.post("/unverified-signup", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            collegeYear,
            cgpa,
            tag,
            resume,
            description,
            profile_pic,
            certificates,
        } = req.body;

        if (!name || !email || !password || !collegeYear || !cgpa) {
            return res
                .status(400)
                .json({ message: "Missing required fields." });
        }

        const existingUser = await UnverifiedUserModel.findOne({ email });
        if (existingUser) {
            return res
                .status(403)
                .json({ message: "Unverified user already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const walletId = generateRandomString(16);

        const unverifiedUser = new UnverifiedUserModel({
            name,
            email,
            password: hashedPassword,
            collegeYear,
            cgpa,
            tag,
            resume: resume ? Buffer.from(resume) : undefined,
            description,
            wallet_id: walletId,
            profile_pic: profile_pic ? Buffer.from(profile_pic) : undefined,
            certificates: certificates ? Buffer.from(certificates) : undefined,
        });

        await unverifiedUser.save();
        await generateWallet(walletId,"U",500);
        return res.status(201).json({
            message: "Signup successful. Please Wait for Verification",
        });
    } catch (error) {
        console.error("Error in unverified signup:", error);
        return res
            .status(500)
            .json({ message: "An error occurred during unverified signup." });
    }
});

// Login Route
user.post("/login", async (req, res) => {
    login(req, res, "U");
});

// Authentication Check
user.get("/auth", (req, res) => {
    return res.status(200).json({ message: "Authenticated." });
});

// Contest Routes
user.get("/contest", findContest);
user.post("/contest/register", registerContest);

// Quiz Routes
user.get("/quizzes", async (req, res) => {
    try {
        const quizzes = await quizModel.find(); // Fetch all quizzes
        if (quizzes.length === 0) {
            return res.status(404).json({ message: "No quizzes found." });
        }
        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return res.status(500).json({ message: "Failed to fetch quizzes." });
    }
});

user.post("/quiz/register", registerQuiz)

// Join Quiz Route with Token Verification
user.get("/quiz/join/:token", (req, res) => {
    const { token } = req.params;
  
    try {
      const verify = jwt.verify(token, String(CONTEST_SECRET)) as CustomJwtPayload;
  
      if (!verify || !verify.quiz_id) {
        return res.status(500).json({ message: "Invalid or missing quiz ID in token." });
      }
  
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
  
      const data = JSON.stringify({
        message: "Update from Stream 1",
        timestamp: new Date().toISOString(),
        quiz: verify,
      });
      res.write(`data: ${data}\n\n`);
  
      const sendEvent = async () => {
        const data = JSON.stringify({
          message: "Quiz update",
          timestamp: new Date().toISOString(),
        });
        res.write(`data: ${data}\n\n`);
      };
  
      sendEvent();
  
      const interval = setInterval(sendEvent, 4000);
  
      req.on("close", () => {
        clearInterval(interval);
        res.end();
      });
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({ message: "Invalid token." });
    }
  });


user.get("/join/:token", (req, res) => {
  const { token } = req.params;

  try {
    const verify = jwt.verify(token, String(CONTEST_SECRET));
    console.log(verify, "this is coolll");

    if (!verify) {
      return res.status(500).json({ message: "You cannot join the room." });
    } else if (!verify.contest_id) {
      throw new Error("Token does not contain contest ID.");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const data = JSON.stringify({ message: 'Update from Stream 1', timestamp: new Date().toISOString() ,contest:verify});
  res.write(`data: ${data}\n\n`);

    const sendEvent = async () => {
      const contestRankings = await pollContest(verify.contest_id);
      const kapa = {
        message: "Update from Stream 1",
        rankings: contestRankings.rankings,
        timestamp: new Date().toISOString(),
      };
      const data = JSON.stringify(kapa);
      res.write(`data: ${data}\n\n`);
    };

    sendEvent();

    const interval = setInterval(sendEvent, 4000);

    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: "Invalid token." });
  }
});
  

// Problem Submission Route
user.post("/submit", submitProblems);

// Utility to generate random string for wallet ID
function generateRandomString(length: number): string {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export { user };
