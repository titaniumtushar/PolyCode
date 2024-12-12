import { NextFunction } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../server";
import { decode } from "punycode";

interface UserRequest extends express.Request {
    decoded?: string;
}

export function authenticateToken(req: any, res: any, next: any) {
    console.log(req.path);

    const m = () => {
        const path = req.path.split("/");
        console.log(path);
        if (path[1] === "user" && path[2] === "join" && path.length === 4) {
            return true;
        }
        return false;
    };
    const p = () => {
        const path = req.path.split("/");
        console.log(path);
        if (path[1] === "community" && path[2] === "join" && path.length === 4) {
            return true;
        }
        return false;
    };

    if (
        req.path === "/community/login" ||
        req.path === "/community/signup" ||
        req.path === "/community/unverified-users" ||
        req.path === "/user/login" ||
        req.path === "/user/signup" ||
        req.path === "/user/unverified-signup" ||
        m() ||
        p()
    ) {
        req.allownext = true;
        req.decoded = null; // Set default value when skipping authorization
        return next();
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token is required!" });
    }

    jwt.verify(token, JWT_SECRET!, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.decoded = decoded;
        next();
    });
}




