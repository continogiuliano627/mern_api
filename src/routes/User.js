import express from "express";
const router = express.Router();
import { createUser, getUser, getUserByEmail } from "../controllers/User.js";
router.get("/", getUser);
router.get("/byEmail/:email", getUserByEmail);
router.post("/", createUser);

export default router;
