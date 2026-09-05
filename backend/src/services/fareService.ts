export type FareMode = "WALK" | "BICYCLE" | "TWO_WHEELER" | "DRIVE" | "AUTO";

export interface FareEstimate {
  estimatedFare: number | null;
  fareCurrency: "INR";
  isEstimate: boolean;
}

export function calculateFare(
  mode: FareMode,
  distanceMeters: number | null
): FareEstimate {
  if (distanceMeters === null || distanceMeters < 0) {
    return {
      estimatedFare: null,
      fareCurrency: "INR",
      isEstimate: true
    };
  }

  const km = distanceMeters / 1000;
  let rawFare = 0;

  switch (mode) {
    case "WALK":
    case "BICYCLE":
      rawFare = 0;
      break;
    case "TWO_WHEELER":
      rawFare = 5 + 2 * km;
      break;
    case "DRIVE":
      rawFare = 30 + 12 * km;
      break;
    case "AUTO":
      rawFare = 30 + 15 * km;
      break;
    default:
      rawFare = 0;
  }

  const roundedFare = Math.round(rawFare / 5) * 5;

  return {
    estimatedFare: roundedFare,
    fareCurrency: "INR",
    isEstimate: true
  };
}
