/**
 * GIS route registration for NCAT datum transforms and IndianaMap parcels/BAFM.
 * Imported by server.ts — keeps zero-key, offline-capable architecture.
 */
import { Application, Request, Response } from "express";
import { transformElevation } from "./services/ncatService";
import { fetchIndianaMapParcels, fetchIndianaMapBafm } from "./services/indianaMapService";
import { BONEBANK_SITE } from "./lib/siteConstants";

export function registerGisRoutes(app: Application) {
  // Corrected NCAT vertical datum transform (NAVD88-first)
  app.get("/api/transform-elevation", async (req: Request, res: Response) => {
    const lat = parseFloat(String(req.query.lat ?? BONEBANK_SITE.lat));
    const lon = parseFloat(String(req.query.lon ?? BONEBANK_SITE.lon));
    const height = parseFloat(String(req.query.height ?? req.query.orthoHtFt ?? BONEBANK_SITE.lagFtNavd88));
    const inVertDatum = String(req.query.inDatum ?? req.query.inVertDatum ?? "navd88");
    const outVertDatum = String(req.query.outDatum ?? req.query.outVertDatum ?? "navd88");

    if (Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(height)) {
      return res.status(400).json({
        error: "Missing or invalid lat, lon, height",
        example: `/api/transform-elevation?lat=${BONEBANK_SITE.lat}&lon=${BONEBANK_SITE.lon}&height=${BONEBANK_SITE.lagFtNavd88}`
      });
    }

    const result = await transformElevation({
      lat,
      lon,
      orthoHtFt: height,
      inVertDatum,
      outVertDatum
    });

    if (!result.success) {
      return res.status(200).json({ ...result, note: "NCAT unreachable — Posey County fallback applied" });
    }
    return res.json(result);
  });

  // IndianaMap / county parcel query with Bonebank envelope fallback
  app.get("/api/indianamap-parcels", async (req: Request, res: Response) => {
    const bbox = req.query.bbox as string | undefined;
    const data = await fetchIndianaMapParcels(bbox);
    res.json({
      ...data,
      meta: {
        node: BONEBANK_SITE.nodeId,
        address: BONEBANK_SITE.address,
        source: data.features?.[0]?.properties?.SOURCE || "IndianaMap",
        envelope: BONEBANK_SITE.envelopeBbox
      }
    });
  });

  // Best Available Floodplain (BAFM) via IDNR / IndianaMap
  app.get("/api/indianamap-bafm", async (req: Request, res: Response) => {
    const bbox = req.query.bbox as string | undefined;
    const data = await fetchIndianaMapBafm(bbox);
    res.json({
      ...data,
      meta: {
        node: BONEBANK_SITE.nodeId,
        bfe_ft_navd88: BONEBANK_SITE.bfeFtNavd88,
        lag_ft_navd88: BONEBANK_SITE.lagFtNavd88,
        source: "IDNR BestAvailableFloodplain / IndianaMap"
      }
    });
  });

  // Site constants for HUD / twin init
  app.get("/api/site/bonebank", (_req: Request, res: Response) => {
    res.json({
      ...BONEBANK_SITE,
      provenance: "docs/SITE_PROVENANCE_BONEBANK.md",
      seal: "NAVD88-HARDENED"
    });
  });
}
