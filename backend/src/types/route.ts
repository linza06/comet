import { NearbyStation } from "./station";

export type TravelMode = "WALK" | "BICYCLE" | "TWO_WHEELER" | "DRIVE";

export interface RouteResult {
  durationSeconds: number | null;
  distanceMeters: number | null;
  status: "OK" | "ZERO_RESULTS" | "ERROR" | "NO_KEY";
  error?: string;
}

export interface CandidateStationRoute {
  station: NearbyStation;
  travelMode: TravelMode;
  durationSeconds: number | null;
  distanceMeters: number | null;
  status: "OK" | "ZERO_RESULTS" | "ERROR" | "NO_KEY";
  error?: string;
}
