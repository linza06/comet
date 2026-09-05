import { Router } from "express";
import { getNearbyStationsHandler } from "../controllers/stationController";

const router = Router();

router.get("/api/stations/nearby", getNearbyStationsHandler);

export default router;
