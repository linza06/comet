import { Router } from "express";
import { getRecommendationsHandler } from "../controllers/recommendationController";

const router = Router();

router.get("/api/recommendations", getRecommendationsHandler);

export default router;
