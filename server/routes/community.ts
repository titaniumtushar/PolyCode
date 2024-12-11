import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CommunityModel, UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { authorizeCommunity } from "../middlewares/authorize";
import { createContest } from "../controllers/createContest";
import { findContest } from "../controllers/findContest";
import { populateContest } from "../middlewares/populateContest";
import { joinContestCommunity } from "../controllers/joinContestCommunity";
import { pollContest } from "../utils/mongoPolling";
import { CONTEST_SECRET } from "../server";
import { UnverifiedUserModel } from "../models/unverifiedUser";
import { checkContest } from "../utils/checkContest";
import { specialTransactions } from "../controllers/transaction";

const community = express.Router();

// Middleware for community authorization
community.use(authorizeCommunity);

// Community Signup Route
community.post("/signup", async (req, res) => {
    signup(req, res, "C");
});

// Community Login Route
community.post("/login", async (req, res) => {
    login(req, res, "C");
});

// Create Contest Route
community.post("/create/contest", createContest);

// Find Contest Route
community.get("/contest", findContest);

// Authorization Check Route
community.get("/auth", (req, res) => {
    return res.status(200).json({ message: "Authenticated." });
});

// Join Contest Route
community.post("/join", populateContest);

// Verify User Function
const verifyUser = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Find user in the unverified-users collection
        const unverifiedUser = await UnverifiedUserModel.findById(userId);
        if (!unverifiedUser) {
            return res.status(404).json({ message: "Unverified user not found" });
        }

        // Create a verified user entry
        const verifiedUser = new UserModel({
            name: unverifiedUser.name,
            email: unverifiedUser.email,
            collegeYear: unverifiedUser.collegeYear,
            cgpa: unverifiedUser.cgpa,
            wallet_id: unverifiedUser.wallet_id,
            tag: unverifiedUser.tag,
            description: unverifiedUser.description,
            resume: unverifiedUser.resume,
            profile_pic: unverifiedUser.profile_pic,
            certificates: unverifiedUser.certificates,
        });

        await verifiedUser.save();

        // Remove the user from unverified collection
        await UnverifiedUserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: "User verified successfully" });
    } catch (err) {
        console.error("Error verifying user:", err);
        res.status(500).json({ message: "An error occurred during verification" });
    }
};

// Verify User Route
community.post("/verify-user", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
  }

  try {
      const unverifiedUser = await UnverifiedUserModel.findById(userId);
      if (!unverifiedUser) {
          return res.status(404).json({ message: "Unverified user not found." });
      }

      // Logic for verifying the user
      const verifiedUser = new UserModel({ ...unverifiedUser.toObject() });
      await verifiedUser.save();
      await UnverifiedUserModel.findByIdAndDelete(userId);

      return res.status(200).json({ message: "User verified successfully." });
  } catch (error) {
      console.error("Error verifying user:", error);
      return res.status(500).json({ message: "An error occurred during verification." });
  }
});



// Pay Rewards for Contest
community.post("/contest/pay-reward", checkContest, async (req, res) => {
    let contest = req.contest;
    let rewards = contest.meta.prize_distribution;

    if (new Date().valueOf() / 1000 < contest.end_time) {
        return res.status(400).json({ message: "Contest is not finished yet." });
    }

    let rankings = contest.rankings;
    const valuesArray = Object.values(rankings);

    try {
        let result = false;

        for (let i = 0; i < 3; i++) {
            if (valuesArray[i]) {
                result = await specialTransactions(
                    valuesArray[i].wallet_id,
                    "U",
                    Number(rewards[i]),
                    req,
                    res
                );
                console.log(result);
            }
        }

        return res.status(200).json({ message: "Payment done." });
    } catch (error) {
        console.error("Error processing payment:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
});

// Fetch All Users Route
community.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({}, { name: 1, _id: 1 });
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "An error occurred while fetching users." });
    }
});

// Fetch All Unverified Users Route
community.get("/unverified-users", async (req, res) => {
    try {
        const unverifiedUsers = await UnverifiedUserModel.find();
        res.status(200).json({ unverifiedUsers });
    } catch (error) {
        console.error("Error fetching unverified users:", error);
        res.status(500).json({ message: "An error occurred while fetching unverified users." });
    }
});

// Join Contest by Token Route
community.get("/join/:token", async (req, res) => {
    const { token } = req.params;
    try {
        const verify = jwt.verify(token, String(CONTEST_SECRET));
        if (!verify) {
            return res.status(400).json({ message: "You cannot join the room." });
        }
        req.contest = verify;
        await joinContestCommunity(req, res);
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Invalid token." });
    }
});

export { community };
