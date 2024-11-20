import express from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CommunityModel,  UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { findContest } from "../controllers/findContest";
require("dotenv");

const user = express.Router();

user.post("/signup", async (req, res) => {
  signup(req,res,"U");
});

user.post("/login", async (req, res) => {
  login(req,res,"U");
});


user.get("/contest",findContest);

user.post("/contest/join/:contest_id",findContest)








export {user};






