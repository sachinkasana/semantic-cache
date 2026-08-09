import express from "express";
import chatRoutes from "./routes/chat.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import { logger } from "./middleware/logger.js";

const app = express();

app.use(express.json());
app.use(logger);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/chat", chatRoutes);
app.use("/stats", statsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
