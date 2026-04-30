import express from "express";
import { improveMessage } from "../controllers/aiController.js";

const router = express.Router();

router.post("/improve-message", improveMessage);

export default router;