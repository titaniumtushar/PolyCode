import express from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CommunityModel,  UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { findContest } from "../controllers/findContest";
import { registerContest } from "../controllers/registerContest";
require("dotenv");

const user = express.Router();

user.post("/signup", async (req, res) => {
  signup(req,res,"U");
});

user.post("/login", async (req, res) => {
  login(req,res,"U");
});




//contest id's

user.get("/contest",findContest);

user.post("/contest/register",registerContest)








export {user};






