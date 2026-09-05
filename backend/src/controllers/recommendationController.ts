import { Request, Response } from "express";
import { getStationRecommendations } from "../services/recommendationService";
import { TravelMode } from "../types/route";

const VALID_TRAVEL_MODES: TravelMode[] = [
  "WALK",
  "BICYCLE",
  "TWO_WHEELER",
  "DRIVE",
  "AUTO"
];

export async function getRecommendationsHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { lat, lng, mode } = req.query;

  if (
    lat === undefined ||
    lng === undefined ||
    lat === "" ||
    lng === "" ||
    Array.isArray(lat) ||
    Array.isArray(lng)
  ) {
    res.status(400).json({ error: "Missing lat or lng query parameter" });
    return;
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);

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

  const modeRaw = mode ?? "DRIVE";
  const modeStr = String(modeRaw).toUpperCase() as TravelMode;

  if (!VALID_TRAVEL_MODES.includes(modeStr)) {
    res.status(400).json({
      error: `Invalid travel mode '${modeRaw}'. Allowed modes: ${VALID_TRAVEL_MODES.join(
        ", "
      )}`
    });
    return;
  }

  try {
    const recommendations = await getStationRecommendations(
      latNum,
      lngNum,
      modeStr
    );
    res.json(recommendations);
  } catch (error) {
    console.error("Error getting station recommendations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
