/**
 * IndianaMap / IDNR ArcGIS REST proxies for parcels & Best Available Floodplain (BAFM).
 * Upstream examples already in use:
 *   - Historic sites: maps.indiana.edu/.../Historic_Sites_IDNR/MapServer/0
 *   - BAFM: dnrmaps.dnr.in.gov/.../BestAvailableFloodplain/MapServer/0
 *
 * Parcel layers vary by county harvest; we query the statewide / county REST
 * endpoints and fall back to a minimal Bonebank envelope polygon.
 */

import { BONEBANK_SITE } from "../lib/siteConstants";

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, unknown>;
    geometry: { type: string; coordinates: unknown };
  }>;
}

const LOCAL_PARCEL_FALLBACK: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        PARCEL_ID: "POSEY-BONEBANK-13101",
        SITE_ADDRESS: BONEBANK_SITE.address,
        OWNER: "PRIVATE",
        ACRES: 2.0,
        SOURCE: "Local-Cache-Bonebank-Envelope",
        TOWNSHIP: "Point Township",
        COUNTY: "Posey"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-88.022, 37.828],
          [-88.018, 37.828],
          [-88.018, 37.832],
          [-88.022, 37.832],
          [-88.022, 37.828]
        ]]
      }
    }
  ]
};

const LOCAL_BAFM_FALLBACK: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        FLD_ZONE: "AE",
        ZONE_SUBTY: "Floodway",
        SOURCE: "Local-Cache-BAFM",
        BFE_FT_NAVD88: BONEBANK_SITE.bfeFtNavd88
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-88.05, 37.80],
          [-87.95, 37.80],
          [-87.95, 37.95],
          [-88.05, 37.95],
          [-88.05, 37.80]
        ]]
      }
    }
  ]
};

/** Candidate ArcGIS REST query URLs for parcels (tried in order) */
const PARCEL_CANDIDATES = [
  "https://maps.indiana.edu/arcgis/rest/services/Infrastructure/Parcels_Boundaries/MapServer/0/query",
  "https://maps.indiana.edu/arcgis/rest/services/Cadastre/Land_Parcels/MapServer/0/query",
  "https://gis.poseycountyin.gov/arcgis/rest/services/Parcels/MapServer/0/query"
];

const BAFM_URL =
  "https://dnrmaps.dnr.in.gov/arcgis/rest/services/DNR/BestAvailableFloodplain/MapServer/0/query";

function bboxToGeometry(bbox: string | undefined): string {
  if (bbox && bbox.split(",").length === 4) return bbox;
  const [xmin, ymin, xmax, ymax] = BONEBANK_SITE.envelopeBbox;
  return `${xmin},${ymin},${xmax},${ymax}`;
}

export async function fetchIndianaMapParcels(bbox?: string): Promise<GeoJSONFeatureCollection> {
  const geometry = bboxToGeometry(bbox);
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "*",
    geometry,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outSR: "4326",
    f: "geojson",
    resultRecordCount: "50"
  });

  for (const base of PARCEL_CANDIDATES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(`${base}?${params.toString()}`, {
        headers: { "User-Agent": "PTDT-v34-Tri-State-Twin (admin@pointtownship.gov)" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) continue;
      const data = await response.json();
      if (data?.features?.length) return data as GeoJSONFeatureCollection;
    } catch {
      // try next candidate
    }
  }
  return LOCAL_PARCEL_FALLBACK;
}

export async function fetchIndianaMapBafm(bbox?: string): Promise<GeoJSONFeatureCollection> {
  const geometry = bboxToGeometry(bbox);
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "FLD_ZONE,ZONE_SUBTY",
    geometry,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outSR: "4326",
    f: "geojson"
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${BAFM_URL}?${params.toString()}`, {
      headers: { "User-Agent": "PTDT-v34-Tri-State-Twin (admin@pointtownship.gov)" },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`BAFM ${response.status}`);
    return (await response.json()) as GeoJSONFeatureCollection;
  } catch {
    return LOCAL_BAFM_FALLBACK;
  }
}
