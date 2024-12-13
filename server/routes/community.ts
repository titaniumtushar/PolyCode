import express, { Request, Response, NextFunction, response } from "express";
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
import { quizModel } from "../models/quiz";
import { checkContest } from "../utils/checkContest";
import { specialTransactions } from "../controllers/transaction";
import { createQuiz } from "../controllers/createQuiz";
import { addProducts, getProducts } from "./product";
import { Document, Types } from "mongoose";
import { populateQuiz } from "../middlewares/populateQuiz";
import { addUserToStageParticipants, createRecruitmentDrive } from "../controllers/recruitmentDrive";
import { RecruitmentDriveModel } from "../models/recruitmentDrive";
import { registerPrivateContest } from "../controllers/RegisterContestPrivately";

const community = express.Router();

// Product Routes
community.get("/product/list", getProducts);
community.post("/product/list", addProducts);

// Middleware for community authorization
community.use(authorizeCommunity);

// Community Signup Route


community.post("/signup", (req: Request, res: Response) =>
    signup(req, res, "C")
);

// Community Login Route
community.post("/login", (req: Request, res: Response) => login(req, res, "C"));

// Create Contest Route
community.post("/create/contest", createContest);

// Find Contest Route
community.get("/contest", findContest);



/// register privately

community.get("/register/privately",registerPrivateContest);


///////this is cool one


community.post("/create/drive", createRecruitmentDrive);
community.get("/recruitment/all", async (req: Request, res: Response) => {
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

community.post(
    "/recruitment/:recruitment_id/inviteusers",
    async (req: Request, res: Response) => {
        const { recruitment_id } = req.params;
        const { user_ids } = req.body; // Assume user_ids is an array of user IDs to invite

        if (!user_ids || !Array.isArray(user_ids)) {
            return res.status(400).json({ message: "Invalid request. user_ids must be an array." });
        }

        try {
            const recruitmentDrive = await RecruitmentDriveModel.findById(recruitment_id);

            if (!recruitmentDrive) {
                return res.status(404).json({ message: "Recruitment drive not found." });
            }

            // Find the first stage in the recruitment drive
            const firstStage = recruitmentDrive.meta.stages[0];

            if (!firstStage) {
                return res.status(404).json({ message: "No stages found in the recruitment drive." });
            }

            // Add users to the first stage participants if not already present
            firstStage.participants = firstStage.participants || [];
            user_ids.forEach(user_id => {
                if (!firstStage.participants.includes(user_id)) {
                    firstStage.participants.push(user_id);
                }
            });

            await recruitmentDrive.save();

            res.status(200).json({ message: "Users invited to the first stage successfully.", stage: firstStage });
        } catch (error) {
            console.error("Error inviting users to recruitment drive:", error);
            res.status(500).json({ message: "Failed to invite users." });
        }
    }
);
community.get("/recruitment/:recruitment_id", async (req: Request, res: Response) => {
    const { recruitment_id } = req.params;

    try {
        const recruitmentDrive = await RecruitmentDriveModel.findById(recruitment_id);

        if (!recruitmentDrive) {
            return res.status(404).json({ message: "Recruitment drive not found." });
        }

        console.log(recruitmentDrive.meta.stages);
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


// Quiz Rout

community.post("/create/quiz", async (req: Request, res: Response) => {
    try {
        // Default to a placeholder or null if `req.decoded` is not set
        const communityId = req.decoded?.id || null;

        // If you need community_id for the quiz, ensure it's in the request body
        if (communityId) {
            req.body.community_id = communityId;
        }

        // Call createQuiz controller
        await createQuiz(req, res);
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Failed to create quiz." });
    }
});

community.get("/quizzes", async (_req: Request, res: Response) => {
    try {
        const quizzes = await quizModel.find();
        res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Failed to fetch quizzes." });
    }
});

community.get("/quiz/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const quiz = await quizModel.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        res.status(200).json({
            rankings: quiz.rankings ? Object.values(quiz.rankings) : [],
            participants: quiz.rankings ? Object.values(quiz.rankings) : [],
        });
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Failed to fetch quiz." });
    }
});


community.put("/quiz/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const quiz = await quizModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        res.status(200).json({ message: "Quiz updated successfully.", quiz });
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({ message: "Failed to update quiz." });
    }
});

community.delete("/quiz/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const quiz = await quizModel.findByIdAndDelete(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }
        res.status(200).json({ message: "Quiz deleted successfully." });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ message: "Failed to delete quiz." });
    }
});

// Join Contest Route
community.post("/join", populateContest);

// Verify User Route
community.post("/verify-user", async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const unverifiedUser = await UnverifiedUserModel.findById(userId);
        if (!unverifiedUser) {
            return res
                .status(404)
                .json({ message: "Unverified user not found." });

            return res
                .status(404)
                .json({ message: "Unverified user not found." });
        }

        const verifiedUser = new UserModel({ ...unverifiedUser.toObject() });
        await verifiedUser.save();
        await UnverifiedUserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: "User verified successfully." });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({
            message: "An error occurred during verification.",
        });
    }
});

// Contest Reward Payment Route
community.post(
    "/contest/pay-reward",
    checkContest,
    async (req: any, res: Response) => {
        const { contest } = req;
        const rewards = contest.meta.prize_distribution;

        if (new Date().valueOf() / 1000 < contest.end_time) {
            return res
                .status(400)
                .json({ message: "Contest is not finished yet." });
        }

        const rankings = contest.rankings;
        const valuesArray = Object.values(rankings);

        try {
            for (let i = 0; i < 3; i++) {
                if (valuesArray[i]) {
                    await specialTransactions(
                        valuesArray[i].wallet_id,
                        "U",
                        Number(rewards[i]),
                        req,
                        res
                    );
                }
            }

            res.status(200).json({ message: "Payment done." });
        } catch (error) {
            console.error("Error processing payment:", error);
            res.status(500).json({ message: "Something went wrong." });
        }
    }
);

// Fetch All Users Route
// community.get("/users", async (_req: Request, res: Response) => {
//     try {
//         const users = await UserModel.find({}, { name: 1, _id: 1 });
//         res.status(200).json({ users });
//     } catch (error) {
//         console.error("Error verifying user:", error);
//         res.status(500).json({
//             message: "An error occurred during verification.",
//         });
//     }
// });

// Contest Reward Payment Route
community.post(
    "/contest/pay-reward",
    checkContest,
    async (req: any, res: Response) => {
        const { contest } = req;
        const rewards = contest.meta.prize_distribution;

        if (new Date().valueOf() / 1000 < contest.end_time) {
            return res
                .status(400)
                .json({ message: "Contest is not finished yet." });
        }

        const rankings = contest.rankings;
        const valuesArray = Object.values(rankings);

        try {
            for (let i = 0; i < 3; i++) {
                if (valuesArray[i]) {
                    await specialTransactions(
                        valuesArray[i].wallet_id,
                        "U",
                        Number(rewards[i]),
                        req,
                        res
                    );
                }
            }

            res.status(200).json({ message: "Payment done." });
        } catch (error) {
            console.error("Error processing payment:", error);
            res.status(500).json({ message: "Something went wrong." });
        }
    }
);

// Fetch All Users Route
community.get("/users", async (_req: Request, res: Response) => {
    try {
        // Fetch all users with all their fields
        const users = await UserModel.find(); // No projection, fetches all fields
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users." });
    }
});

  

// Fetch All Unverified Users Route
community.get("/unverified-users", async (_req: Request, res: Response) => {
    try {
        const unverifiedUsers = await UnverifiedUserModel.find();
        res.status(200).json({ unverifiedUsers });
    } catch (error) {
        console.error("Error fetching unverified users:", error);

        res.status(500).json({
            message: "An error occurred while fetching unverified users.",
        });
    }
});

// Join Contest by Token Route
community.get("/join/:token", async (req: Request, res: Response) => {
    const { token } = req.params;
    try {
        const verify = jwt.verify(token, String(CONTEST_SECRET));
        if (!verify) {
            return res
                .status(400)
                .json({ message: "You cannot join the room." });
        }
        req.contest = verify;
        await joinContestCommunity(req, res);
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ message: "Invalid token." });
    }
});




export { community };
