import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CommunityModel, UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { findContest } from "../controllers/findContest";
import { registerContest } from "../controllers/registerContest";
import { CONTEST_SECRET, JWT_SECRET } from "../server";
import { submitProblems } from "../controllers/submitProblems";
import { pollContest } from "../utils/mongoPolling";
require("dotenv");

const user = express.Router();

// Signup Route
user.post("/signup", async (req, res) => {
  signup(req, res, "U");
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
      return res.status(500).json({ message: "You cannot join the room." });
    } else if (!verify.contest_id) {
      throw new Error("Token does not contain contest ID.");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

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


export { user };
