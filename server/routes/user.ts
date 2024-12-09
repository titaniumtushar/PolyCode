import express from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CommunityModel,  UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { findContest } from "../controllers/findContest";
import { registerContest } from "../controllers/registerContest";
import { CONTEST_SECRET, JWT_SECRET } from "../server";
import { submitProblems } from "../controllers/submitProblems";
import { pollContest } from "../utils/mongoPolling";
require("dotenv");

const user = express.Router();

user.post("/signup", async (req, res) => {
  signup(req,res,"U");
});

user.post("/login", async (req, res) => {
  login(req,res,"U");
});


user.get("/auth",(req,res)=>{
  return res.status(200).json({message:"Authenticated."})
})

//contest id's

user.get("/contest",findContest);

user.post("/contest/register",registerContest)
user.get("/join/:token", (req, res) => {
  const {token}= req.params;
  
  const verify = jwt.verify(token,String(CONTEST_SECRET));
  console.log(verify,"this is coolll");

  if(!verify){
    return res.status(500).json({message:"You can not join the room."});
  }
  else if(!verify.contest_id){
    throw new Error("Token dont have contest id.")
  }

  

  
  console.log(req.params.token);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');


  const data = JSON.stringify({ message: 'Update from Stream 1', timestamp: new Date().toISOString() ,contest:verify});
  res.write(`data: ${data}\n\n`);


  
  

  const sendEvent = async () => {
    let contestRankings = await pollContest(verify.contest_id);
    let kapa = { message: 'Update from Stream 1',rankings:contestRankings.rankings, timestamp: new Date().toISOString()}
    
    

    

    
    const data = JSON.stringify(kapa);
    res.write(`data: ${data}\n\n`);
  };

  

  
  sendEvent();

  
  const interval = setInterval(sendEvent, 4000);

  
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});


user.post("/submit",submitProblems);









export {user};






