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
import { checkContest } from "../utils/checkContest";
import { specialTransactions } from "../controllers/transaction";

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



// community pay wala karna hain contest se le ke 
community.post("/contest/pay-reward",checkContest,async(req:any,res:any)=>{



  let contest:any = req.contest;
  let rewards:any = contest.meta.prize_distribution;
  
  let rankings:any = contest.rankings;
  const valuesArray:any = Object.values(rankings);


 try {

  let ress= false;

  if(valuesArray[0]){
    ress = await specialTransactions(valuesArray[0].wallet_id,"U",Number(rewards[0]),req,res);
    console.log(ress);

  }
   if(valuesArray[1]){
    ress = await specialTransactions(valuesArray[1].wallet_id,"U",Number(rewards[1]),req,res);
    console.log(ress);

  }
  if(valuesArray[2]){
    ress= await specialTransactions(valuesArray[2].wallet_id,"U",Number(rewards[2]),req,res);
    console.log(ress);

  }

    res.send("ae halloooo");



 } catch (error) {
  
  res.send("ae halloooo");
  
 }

})









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
