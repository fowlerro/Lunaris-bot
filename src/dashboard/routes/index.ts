import express from "express";
import auth from "./auth";
import guilds from "./guilds";
import profile from "./profile";
// import discord from './discord'

const router = express.Router();

router.use("/auth", auth);
router.use("/guilds", guilds);
router.use("/profile", profile);

// router.use('/discord', discord);

export default router;
