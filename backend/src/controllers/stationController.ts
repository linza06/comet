import { Request, Response } from "express";
import { findNearbyStations } from "../services/stationService";

export async function getNearbyStationsHandler(
  req: Request,
  res: Response
): Promise<void> {
  const { lat, lng } = req.query;

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

  try {
    const stations = await findNearbyStations(latNum, lngNum);
    res.json(stations);
  } catch (error) {
    console.error("Error finding nearby stations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
