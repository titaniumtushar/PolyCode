import express from "express";
import { community } from "./community";
import { user } from "./user";

const router = express.Router();

router.use("/community", community);
router.use("/user",user)

export default router;
