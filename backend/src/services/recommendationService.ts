import { computeCandidateStationRoutes } from "./routingService";
import { TravelMode } from "../types/route";
import { RecommendationResponse } from "../types/recommendation";

export async function getStationRecommendations(
  lat: number,
  lng: number,
  travelMode: TravelMode
): Promise<RecommendationResponse> {
  const allCandidateRoutes = await computeCandidateStationRoutes(
    lat,
    lng,
    travelMode
  );

  const validRoutes = allCandidateRoutes.filter(
    (r) =>
      r.status === "OK" &&
      r.durationSeconds !== null &&
      typeof r.durationSeconds === "number"
  );

  validRoutes.sort((a, b) => a.durationSeconds! - b.durationSeconds!);

  if (validRoutes.length === 0) {
    return {
      recommendedStation: null,
      alternatives: allCandidateRoutes,
      travelMode
    };
  }

  const [recommendedStation, ...alternatives] = validRoutes;

  const failedRoutes = allCandidateRoutes.filter(
    (r) => r.status !== "OK" || r.durationSeconds === null
  );

  return {
    recommendedStation,
    alternatives: [...alternatives, ...failedRoutes],
    travelMode
  };
}
