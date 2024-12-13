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
import { generateMultipleUrls } from "./s3upload";
import { populateQuiz } from "../middlewares/populateQuiz"; // Import the middleware
import { authenticateToken } from "../middlewares/authenticateToken"; // Import the authentication middleware
import { quizModel } from "../models/quiz"; //
import { registerQuiz } from "../controllers/registerQuiz";
import { submitQuiz } from "../controllers/submitQuiz";
import { joinPrivateContest } from "../controllers/joinPrivateContest";
import { RecruitmentDriveModel } from "../models/recruitmentDrive";

require("dotenv");

const user = express.Router();

// Signup Route
user.post("/signup", async (req, res) => {
    signup(req, res, "U");
});

user.get("/product/list", getProducts);
user.get("/recruitment/all", async (req: Request, res: Response) => {
  try {
      const recruitmentDrives = await RecruitmentDriveModel.find();
      const formattedDrives = recruitmentDrives.map(drive => ({
          _id: drive._id,
          drive_name: drive.meta.drive_name,
          description: drive.meta.description,
          company_id: drive.meta.company_id,
          start_date: drive.meta.start_date,
          end_date: drive.meta.end_date,
      }));
      res.status(200).json(formattedDrives);
  } catch (error) {
      console.error("Error fetching recruitment drives:", error);
      res.status(500).json({ message: "Failed to fetch recruitment drives." });
  }
});
user.get("/recruitment/:recruitment_id", async (req: Request, res: Response) => {
  const { recruitment_id } = req.params;

  try {
      const recruitmentDrive = await RecruitmentDriveModel.findById(recruitment_id);

      if (!recruitmentDrive) {
          return res.status(404).json({ message: "Recruitment drive not found." });
      }

      res.status(200).json({
          recruitmentDrive: {
              meta: {
                  drive_name: recruitmentDrive.meta.drive_name,
                  invitation_code: recruitmentDrive.meta.invitation_code,
                  stages: recruitmentDrive.meta.stages,
                  company_id: recruitmentDrive.meta.company_id,
                  start_date: recruitmentDrive.meta.start_date,
                  end_date: recruitmentDrive.meta.end_date,
                  description: recruitmentDrive.meta.description,
              },
              _id: recruitmentDrive._id,
              start_date: recruitmentDrive.start_date,
              end_date: recruitmentDrive.end_date,
          },
      });
  } catch (error) {
      console.error("Error fetching recruitment drive:", error);
      res.status(500).json({ message: "Failed to fetch recruitment drive." });
  }
});
// Unverified Signup Route
user.post("/unverified-signup", async (req, res) => {
    const DataUrl = "https://polycodearena.s3.eu-north-1.amazonaws.com/";

    try {
        const {
            name,
            email,
            password,
            collegeYear,
            cgpa,
            tag,
            description,
            contentType,
        } = req.body;

        const mimeToExtension: Record<string, string> = {
            "image/jpeg": "jpeg",
            "image/png": "png",
        };

        function getFileExtension(contentType: string): string {
            return mimeToExtension[contentType] || "unknown";
        }

        const fileExtension = getFileExtension(contentType);

        const profile_pic = `${DataUrl}${name}/profile_pic.${fileExtension}`;
        const resume_url = `${DataUrl}${name}/resume.pdf`;
        const certificates = `${DataUrl}${name}/certificate.pdf`;

        console.log(profile_pic);

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
            collegeYear: collegeYear,
            cgpa: cgpa,
            tag: tag,
            resume_url: resume_url,
            description: description,
            wallet_id: walletId,
            profile_pic: profile_pic,
            certificates: certificates,
        });

        await unverifiedUser.save();

        const urls = await generateMultipleUrls(name, contentType);
        console.log("Generated URLs:", urls);

        await generateWallet(walletId, "U", 500);
        return res.status(201).json({
            message: "Signup successful. Please Wait for Verification",
            urls: urls,
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

user.get("/assets", async (req, res) => {
    try {
        const userId = req.decoded?.id;
        // Access userId from decoded token
        console.log(userId + " user id in asset routes ");
        // Fetch user data from the database
        const user = await UserModel.findById(userId).select(
            "profile_pic resume_url certificates name tag"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Respond with the user's assets
        return res.status(200).json({
            profilePic: user.profile_pic,
            resumeUrl: user.resume_url,
            certificates: user.certificates,
            username: user.name,
            tag: user.tag,
        });
    } catch (error) {
        console.error("Error fetching user assets:", error);
        return res
            .status(500)
            .json({ message: "An error occurred while fetching user assets." });
    }
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

user.post("/quiz/register", registerQuiz);

// Join Quiz Route with Token Verification
user.get("/quiz/join/:token", (req, res) => {
    const { token } = req.params;

    try {
        const verify = jwt.verify(
            token,
            String(CONTEST_SECRET)
        ) as CustomJwtPayload;

        if (!verify || !verify.quiz_id) {
            return res
                .status(500)
                .json({ message: "Invalid or missing quiz ID in token." });
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

user.get("/quiz/:id/questions", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await quizModel.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        // Access the question_set inside the meta object
        const questions = quiz.meta.question_set;
        if (!questions || questions.length === 0) {
            return res
                .status(404)
                .json({ message: "No questions found for this quiz." });
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        res.status(500).json({ message: "Failed to fetch quiz questions." });
    }
});

user.post("/join/private/contest", joinPrivateContest);

user.get("/join/:token", (req, res) => {
    const { token } = req.params;

    try {
        const verify = jwt.verify(token, String(CONTEST_SECRET));
        console.log(verify, "this is coolll");

        if (!verify) {
            return res
                .status(500)
                .json({ message: "You cannot join the room." });
        } else if (!verify.contest_id) {
            throw new Error("Token does not contain contest ID.");
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const data = JSON.stringify({
            message: "Update from Stream 1",
            timestamp: new Date().toISOString(),
            contest: verify,
        });
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

user.post("/submit/quiz", submitQuiz);
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
