export type TravelMode = "AUTO" | "DRIVE" | "TWO_WHEELER" | "WALK" | "BICYCLE";

export interface Station {
  id: number;
  name: string;
  line: string | null;
  city: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
}

export interface CandidateStationRoute {
  station: Station;
  travelMode: TravelMode;
  durationSeconds: number | null;
  distanceMeters: number | null;
  estimatedFare: number | null;
  fareCurrency: "INR";
  isEstimate: boolean;
  status: "OK" | "ZERO_RESULTS" | "ERROR" | "NO_KEY";
  error?: string;
}

export interface RecommendationResponse {
  recommendedStation: CandidateStationRoute | null;
  alternatives: CandidateStationRoute[];
  travelMode: TravelMode;
}
