import express from "express";
import { community } from "./community";
import { user } from "./user";
import { authenticateToken } from "../middlewares/token";
import { wallet } from "./wallet.router";

const router = express.Router();

router.use(authenticateToken);
router.use("/community", community);
router.use("/user", user);
router.use("/wallet", wallet);

export default router;
