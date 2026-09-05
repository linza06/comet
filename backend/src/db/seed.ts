import fs from "fs";
import path from "path";
import { pool } from "./pool";

interface StationSeed {
  seq: number;
  name: string;
  line: string;
  city: string;
  lat: number;
  lng: number;
  source: string;
}

export async function seedStations() {
  const seedFilePath = path.join(__dirname, "seeds", "kochi_stations.json");
  const rawData = fs.readFileSync(seedFilePath, "utf-8");
  const stations: StationSeed[] = JSON.parse(rawData);

  console.log(`Seeding ${stations.length} stations...`);

  // Clear existing stations to avoid duplicates on re-run
  await pool.query("TRUNCATE TABLE stations RESTART IDENTITY;");

  const insertQuery = `
    INSERT INTO stations (name, line, city, geom)
    VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography);
  `;

  for (const s of stations) {
    await pool.query(insertQuery, [s.name, s.line, s.city, s.lng, s.lat]);
  }

  const res = await pool.query("SELECT COUNT(*) FROM stations;");
  console.log(`Seeding complete. Total stations in DB: ${res.rows[0].count}`);
}

if (require.main === module) {
  seedStations()
    .then(() => pool.end())
    .catch((err) => {
      console.error("Error seeding stations:", err);
      pool.end();
      process.exit(1);
    });
}
