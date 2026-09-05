import { env } from "../config/env";
import { TravelMode, RouteResult, CandidateStationRoute } from "../types/route";
import { findNearbyStations } from "./stationService";

export async function computeRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  travelMode: TravelMode
): Promise<RouteResult> {
  const apiKey = env.googleMapsApiKey;

  if (!apiKey) {
    return {
      durationSeconds: null,
      distanceMeters: null,
      status: "NO_KEY",
      error: "Google Maps API key is not configured"
    };
  }

  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  const requestBody = {
    origin: {
      location: {
        latLng: {
          latitude: originLat,
          longitude: originLng
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: destLat,
          longitude: destLng
        }
      }
    },
    travelMode: travelMode
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      const sanitizedError = errorText.replace(new RegExp(apiKey, "g"), "***MASKED***");
      console.error(`Google Routes API error (${response.status}):`, sanitizedError);
      return {
        durationSeconds: null,
        distanceMeters: null,
        status: "ERROR",
        error: `Google Routes API error: ${response.status}`
      };
    }

    const data = (await response.json()) as any;

    if (!data.routes || data.routes.length === 0) {
      return {
        durationSeconds: null,
        distanceMeters: null,
        status: "ZERO_RESULTS"
      };
    }

    const route = data.routes[0];
    const distanceMeters = route.distanceMeters !== undefined ? Number(route.distanceMeters) : null;
    let durationSeconds: number | null = null;

    if (route.duration) {
      durationSeconds = parseInt(String(route.duration).replace("s", ""), 10);
      if (isNaN(durationSeconds)) {
        durationSeconds = null;
      }
    }

    return {
      durationSeconds,
      distanceMeters,
      status: "OK"
    };
  } catch (error: any) {
    console.error("Failed to connect to Google Routes API:", error?.message || error);
    return {
      durationSeconds: null,
      distanceMeters: null,
      status: "ERROR",
      error: "Failed to connect to routing service"
    };
  }
}

export async function computeCandidateStationRoutes(
  userLat: number,
  userLng: number,
  travelMode: TravelMode
): Promise<CandidateStationRoute[]> {
  const candidateStations = await findNearbyStations(userLat, userLng);

  const routePromises = candidateStations.map(async (station) => {
    const route = await computeRoute(
      userLat,
      userLng,
      station.latitude,
      station.longitude,
      travelMode
    );

    return {
      station,
      travelMode,
      durationSeconds: route.durationSeconds,
      distanceMeters: route.distanceMeters,
      status: route.status,
      ...(route.error ? { error: route.error } : {})
    };
  });

  return Promise.all(routePromises);
}
