import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CommunityModel, UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { UnverifiedUserModel } from "../models/unverifiedUser"; // Import your UnverifiedUser model
import { findContest } from "../controllers/findContest";
import { registerContest } from "../controllers/registerContest";
import { CONTEST_SECRET, JWT_SECRET } from "../server";
import { submitProblems } from "../controllers/submitProblems";
import { pollContest } from "../utils/mongoPolling";
import { getProducts } from "./product";
import { generateMultipleUrls } from "./s3upload";

require("dotenv");

const user = express.Router();

// Signup Route
user.post("/signup", async (req, res) => {
    signup(req, res, "U");
});

user.get("/product/list", getProducts);

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

// Contest Routes
user.get("/contest", findContest);
user.post("/contest/register", registerContest);

// Join Contest Route with Token Verification
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
