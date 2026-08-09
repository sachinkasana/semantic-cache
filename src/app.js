import express from "express";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/chat", chatRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
