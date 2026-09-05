import { CandidateStationRoute, TravelMode } from "./route";

export interface RecommendationResponse {
  recommendedStation: CandidateStationRoute | null;
  alternatives: CandidateStationRoute[];
  travelMode: TravelMode;
}
