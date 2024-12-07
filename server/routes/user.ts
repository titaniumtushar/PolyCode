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
user.get("/join/:token", (req, res) => {

  console.log(req.params.token);

  
  console.log(req.params.token);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = () => {
    const data = JSON.stringify({ message: 'Update from Stream 1', timestamp: new Date().toISOString() });
    res.write(`data: ${data}\n\n`);
  };

  // Send initial data
  sendEvent();

  // Send periodic updates
  const interval = setInterval(sendEvent, 5000);

  // Cleanup on connection close
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});









export {user};






