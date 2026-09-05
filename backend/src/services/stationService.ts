import { pool } from "../db/pool";
import { env } from "../config/env";
import { NearbyStation } from "../types/station";

export async function findNearbyStations(
  lat: number,
  lng: number
): Promise<NearbyStation[]> {
  const query = `
    SELECT
      id,
      name,
      line,
      city,
      ST_Y(geom::geometry) AS latitude,
      ST_X(geom::geometry) AS longitude,
      ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS "distanceMeters"
    FROM stations
    WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
    ORDER BY "distanceMeters" ASC
    LIMIT $4;
  `;

  const result = await pool.query(query, [
    lng,
    lat,
    env.searchRadiusMeters,
    env.candidateStationCount
  ]);

  return result.rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    line: row.line,
    city: row.city,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    distanceMeters: Number(row.distanceMeters)
  }));
}
