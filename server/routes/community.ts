import express from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { CommunityModel, UserModel } from "../models/user";
import { signup } from "./signup";
import { login } from "./login";
import { authorizeCommunity, authorizeUser } from "../middlewares/authorize";
import { createContest } from "../controllers/createContest";
import { findContest } from "../controllers/findContest";
import { populateContest } from "../middlewares/populateContest";
import { joinContestCommunity } from "../controllers/joinContestCommunity";
import { pollContest } from "../utils/mongoPolling";
import { CONTEST_SECRET } from "../server";

const community = express.Router();

community.use(authorizeCommunity);

community.post("/signup", async (req, res) => {
    signup(req, res, "C");
});

community.post("/login", async (req, res) => {
    login(req, res, "C");
});

community.post("/create/contest", createContest);

community.get("/contest", findContest);

community.get("/auth",(req,res)=>{
  return res.status(200).json({message:"Authenticated."});
})

community.post("/join", populateContest);

// NEW: Fetch All Users Route
community.get("/users", async (req, res) => {
  try {
    // Fetch all users with selected fields (e.g., name and _id)
    const users = await UserModel.find({}, { name: 1, _id: 1 });

    // Respond with the list of users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred while fetching users." });
  }
});


community.get("/join/:token", (req:any, res:any) => {
  const {token}= req.params;
  console.log("dndjfbdfj hellllllllllllllllllllllo");
  const verify:any = jwt.verify(token,String(CONTEST_SECRET));
  
  console.log(verify);
  console.log(verify,"this is coolll");

  if(!verify){
    return res.status(500).json({message:"You can not join the room."});
  }
  
  req.contest = verify;
  joinContestCommunity(req,res);

  

  
  
    
});


export { community };
