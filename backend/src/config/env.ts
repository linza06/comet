import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL || "",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  searchRadiusMeters: Number(process.env.SEARCH_RADIUS_METERS) || 5000,
  candidateStationCount: Number(process.env.CANDIDATE_STATION_COUNT) || 5
};
