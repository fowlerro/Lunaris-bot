import express from "express";
import { getGuildsController } from "./index.controller";
import { isAuthenticated } from "../../utils/middlewares";

const router = express.Router();

router.get("/", isAuthenticated, getGuildsController);

export default router;
