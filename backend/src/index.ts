import express from "express";
import { env } from "./config/env";
import healthRouter from "./routes/health";
import stationRouter from "./routes/stationRoutes";

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(stationRouter);

app.listen(env.port, () => {
  console.log(`Comet backend listening on port ${env.port}`);
});
