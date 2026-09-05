export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds < 0) return "--";
  const mins = Math.round(seconds / 60);
  if (mins === 0) return "< 1 min";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""}`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  return `${hrs} hr${hrs > 1 ? "s" : ""} ${remainingMins} min${remainingMins !== 1 ? "s" : ""}`;
}

export function formatDistance(meters: number | null): string {
  if (meters === null || meters < 0) return "--";
  if (meters < 1000) return `${Math.round(meters)} m`;
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

export function formatFare(fare: number | null, currency = "INR"): string {
  if (fare === null) return "N/A";
  if (fare === 0) return "Free (₹0)";
  return `₹${fare}`;
}
