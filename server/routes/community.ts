import express from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CommunityModel,  UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
require("dotenv");

const community = express.Router();

community.post("/signup", async (req, res) => {
  signup(req,res,"C");
});

community.post("/login", async (req, res) => {
  login(req,res,"C");
});


community.get("/hawa",(req,res)=>{
  res.cookie("j","as");
  res.send("W");
})







export {community};






