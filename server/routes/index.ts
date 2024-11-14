import express from "express";
import { community } from "./community";

const router = express.Router();

router.use("/community", community);

export default router;
