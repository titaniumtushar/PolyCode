import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../server";

interface DecodedToken {
    userId?: string;
    quizId?: string;
    [key: string]: any; // Extendable for additional claims
}

interface UserRequest extends Request {
    decoded?: DecodedToken;
    allownext?: boolean;
}

export function authenticateToken(req: UserRequest, res: Response, next: NextFunction): void {
    console.log("Request Path:", req.path);

    // Helper function to check specific paths
    const isUserJoinPath = (): boolean => {
        const path = req.path.split("/");
        console.log("User Path:", path);
        return path[1] === "user" && path[2] === "join" && path.length === 4;
    };

    const isCommunityJoinPath = (): boolean => {
        const path = req.path.split("/");
        console.log("Community Path:", path);
        return path[1] === "community" && path[2] === "join" && path.length === 4;
    };

    // Allow paths that do not require authentication
    if (
        req.path === "/community/login" ||
        req.path === "/community/signup" ||
        req.path === "/community/create/quiz" ||
        req.path === "/community/unverified-users" ||
        req.path === "/user/login" ||
        req.path === "/user/signup" ||
        req.path === "/user/unverified-signup" ||
        isUserJoinPath() ||
        isCommunityJoinPath()
    ) {
        req.allownext = true;
        req.decoded = undefined; // Explicitly set to undefined for consistency
        return next();
    }

    // Retrieve token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token is required!" });
    }

    // Verify the token and attach the decoded payload to the request object
    jwt.verify(token, JWT_SECRET!, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        console.log("Decoded JWT:", decoded); // Add this log
        req.decoded = decoded;
        next();
    });
}
