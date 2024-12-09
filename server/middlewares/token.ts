import { NextFunction } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../server";
import { decode } from "punycode";

interface UserRequest extends express.Request {
    decoded?: string;
}

export function authenticateToken(
    req: UserRequest,
    res: express.Response,
    next: NextFunction
) {


    console.log(req.path);

    const m = ()=>{
        const path = req.path.split("/");
        console.log(path);
        if(path[1]==="user" && path[2]==="join" && path.length===4){
            return true;
        }
        return false;
    }
    console.log(m())

    const p = ()=>{
        const path = req.path.split("/");
        console.log(path);
        if(path[1]==="community" && path[2]==="join" && path.length===4){
            return true;
        }
        return false;
    }
    console.log(p())
    
    if(req.path ==="/community/login" || req.path ==="/community/signup" ||req.path ==="/user/login"||req.path ==="/user/signup" || m() ){
        console.log("djkfkdjfdfkjdf");
        return next();
    }
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader?.split(" ")[1];
    console.log(token);
    if (!token) {
        return res
            .status(401)
            .json({ message:"Token is required!"});
    }

    jwt.verify(token, JWT_SECRET!, (err:any, decoded:any) => {
        if (err) {
            return res
                .status(403)
                .json({ message: "Invalid token" });
        }
        req.decoded = decoded;
        next();
    });


    
}



