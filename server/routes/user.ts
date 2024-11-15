import express from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CommunityModel,  UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
require("dotenv");

const user = express.Router();

user.post("/signup", async (req, res) => {
  signup(req,res,"U");
});

user.post("/login", async (req, res) => {
  login(req,res,"U");
});









export {user};






