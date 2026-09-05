import { Router } from "express";
import { getCandidateStationRoutesHandler } from "../controllers/routeController";

const router = Router();

router.get("/api/routes", getCandidateStationRoutesHandler);
router.post("/api/routes", getCandidateStationRoutesHandler);

export default router;
