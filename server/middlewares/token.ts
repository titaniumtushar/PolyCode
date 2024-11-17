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



