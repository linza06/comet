import { Request, Response } from "express";
import { computeCandidateStationRoutes } from "../services/routingService";
import { TravelMode } from "../types/route";

const VALID_TRAVEL_MODES: TravelMode[] = ["WALK", "BICYCLE", "TWO_WHEELER", "DRIVE"];

export async function getCandidateStationRoutesHandler(
  req: Request,
  res: Response
): Promise<void> {
  const latRaw = req.query.lat ?? req.body?.lat;
  const lngRaw = req.query.lng ?? req.body?.lng;
  const modeRaw = req.query.mode ?? req.body?.mode ?? "DRIVE";

  if (
    latRaw === undefined ||
    lngRaw === undefined ||
    latRaw === "" ||
    lngRaw === "" ||
    Array.isArray(latRaw) ||
    Array.isArray(lngRaw)
  ) {
    res.status(400).json({ error: "Missing lat or lng query/body parameter" });
    return;
  }

  const latNum = Number(latRaw);
  const lngNum = Number(lngRaw);

  if (
    isNaN(latNum) ||
    isNaN(lngNum) ||
    latNum < -90 ||
    latNum > 90 ||
    lngNum < -180 ||
    lngNum > 180
  ) {
    res.status(400).json({ error: "Invalid lat or lng values" });
    return;
  }

  const modeStr = String(modeRaw).toUpperCase() as TravelMode;
  if (!VALID_TRAVEL_MODES.includes(modeStr)) {
    res.status(400).json({
      error: `Invalid travel mode '${modeRaw}'. Allowed modes: ${VALID_TRAVEL_MODES.join(", ")}`
    });
    return;
  }

  try {
    const routes = await computeCandidateStationRoutes(latNum, lngNum, modeStr);
    res.json(routes);
  } catch (error) {
    console.error("Error computing candidate station routes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
