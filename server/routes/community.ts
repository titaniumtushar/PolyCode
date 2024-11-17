import express from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CommunityModel, UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { authorizeCommunity, authorizeUser } from "../middlewares/authorize";
import { createContest } from "../controllers/createContest";

const community = express.Router();

community.use(authorizeCommunity);

community.post("/signup", async (req, res) => {
    signup(req, res, "C");
});

community.post("/login", async (req, res) => {
    login(req, res, "C");
});

community.post("/create/contest", createContest);

export { community };
