export interface NearbyStation {
  id: number;
  name: string;
  line: string | null;
  city: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
}
