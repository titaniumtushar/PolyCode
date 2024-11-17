import {  Models } from "mongoose";
import { CommunityModel, UserModel } from "../models/user";
import { compare } from "../utils/hash";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../server";

type role = "C" | "U";




export async function login(req:any,res:any,role:role){
    const {email,password} = req.body;

    if(!email|| !password){
        return res.status(403).json({message:"Invalid Input."})

    }
    let loginEntry:any;

    try {

         if(role==="C"){
        loginEntry = await CommunityModel.findOne({email:email});
    }
    else{
        loginEntry = await UserModel.findOne({email:email});
    }

    if(!loginEntry){
        return res.status(404).json({message:"Email doesnt exists"})
    }

    console.log(loginEntry);
    let k = compare(password,loginEntry.password);

    if(!k){
        return res.status(403).json({message:"Email or Password is wrong."})

    }
    
    const payload:{name:string,email:string,role:role} = {
        name:loginEntry.name,
        email:loginEntry.email,
        role:role
        
    }
    const jwtToken =  jwt.sign(payload,JWT_SECRET);
    return res.status(200).json({token:jwtToken});
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({message:"Something Went Wrong."})

        
    }
}



