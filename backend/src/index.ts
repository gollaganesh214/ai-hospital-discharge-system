import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { patientsRouter } from "./modules/patients/router.js";
import { dischargesRouter } from "./modules/discharges/router.js";
import { authRouter } from "./modules/auth/router.js";
import { usersRouter } from "./modules/users/router.js";
import { admissionsRouter } from "./modules/admissions/router.js";
import { reportsRouter } from "./modules/reports/router.js";
import { labsRouter } from "./modules/labs/router.js";
import { prisma } from "./common/prisma.js";

dotenv.config();

const app = express();
const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);
app.use(
  cors(
    corsOrigins.length
      ? { origin: corsOrigins }
      : { origin: true }
  )
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("AI Hospital Backend is running. Use /api/health for status.");
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API root. Use /api/health or POST /api/auth/login|register."
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Demo endpoints (no auth) for browser preview
app.get("/api/demo/patients", async (_req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      take: 25
    });
    res.json({ data: patients });
  } catch (err) {
    res.status(500).json({ error: "Failed to load patients" });
  }
});

app.get("/api/demo/admissions", async (_req, res) => {
  try {
    const admissions = await prisma.admission.findMany({
      orderBy: { admittedAt: "desc" },
      include: { patient: true, dischargeSummary: true },
      take: 25
    });
    res.json({ data: admissions });
  } catch (err) {
    res.status(500).json({ error: "Failed to load admissions" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/admissions", admissionsRouter);
app.use("/api/discharges", dischargesRouter);
app.use("/api/labs", labsRouter);
app.use("/api/users", usersRouter);
app.use("/api/reports", reportsRouter);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
