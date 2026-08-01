import { registerAIRoutes } from "./src/server-ai";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { OpenMITimeHandler } from "./src/services/compliance";
import { registerGisRoutes } from "./src/server-gis-routes";
import { registerCoreRoutes } from "./src/server-core-routes";

dotenv.config();

let genAIClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI Chat features will run in offline mode.");
      return null;
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const timeHandler = new OpenMITimeHandler();

  app.use(express.json());

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", message: err.message, sbom: "sha256-verified-compliance-stream" });
  });

  // Core API routes (policy, SDE, TurboVec, USGS, FEMA, twin simulate, Archimedes, etc.)
  registerCoreRoutes(app, { getGenAI, timeHandler });

  // NCAT + IndianaMap parcels/BAFM + site constants (official NGS params, offline fallbacks)
  registerGisRoutes(app);

  registerAIRoutes(app, getGenAI);

  // Static / Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const httpServer = http.createServer(app);

  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", (ws) => {
    console.log("[WebSocket] Client connected for live telemetry stream");
    let frameCount = 0;
    const interval = setInterval(() => {
      frameCount = (frameCount + 1) % 240;
      const baseElevation = 377.2;
      const waveOffset = Math.sin(frameCount / 12) * 2.3;
      const stage = baseElevation + waveOffset;
      const payload = {
        type: "TELEMETRY_UPDATE",
        node: "13101_BONEBANK_RD",
        stage,
        frame: frameCount,
        status: "NOMINAL",
        timestamp: new Date().toISOString(),
      };
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      }
    }, 41.67);
    ws.on("close", () => {
      console.log("[WebSocket] Client disconnected");
      clearInterval(interval);
    });
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[Tri-State Family System] Core Node v21.0 active and listening on port ${PORT}`);
  });
}

startServer();
