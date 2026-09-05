import { API_BASE_URL } from "../utils/config";
import { RecommendationResponse, TravelMode } from "../types/recommendation";

export async function fetchRecommendations(
  lat: number,
  lng: number,
  mode: TravelMode
): Promise<RecommendationResponse> {
  const url = `${API_BASE_URL}/api/recommendations?lat=${lat}&lng=${lng}&mode=${mode}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || `Server error (${response.status})`);
  }
  return response.json();
}
