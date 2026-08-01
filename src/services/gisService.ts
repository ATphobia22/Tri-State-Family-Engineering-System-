/**
 * Client-side GIS fetch helpers (FEMA, IndianaMap historic, IDNR BAFM, NWS).
 * All endpoints proxy through the Express node for offline-capable fallbacks.
 */
export interface GeoJSONFeature {
  type: string;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export type BBox = [number, number, number, number]; // [xmin, ymin, xmax, ymax] WGS84

const EMPTY_FC: GeoJSONFeatureCollection = { type: "FeatureCollection", features: [] };

function isValidBBox(bbox: BBox): boolean {
  return (
    Array.isArray(bbox) &&
    bbox.length === 4 &&
    bbox.every((n) => typeof n === "number" && Number.isFinite(n))
  );
}

async function fetchGeoJson(url: string, label: string): Promise<GeoJSONFeatureCollection> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${label} HTTP ${res.status}`);
    const data = (await res.json()) as GeoJSONFeatureCollection;
    if (!data || data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
      return EMPTY_FC;
    }
    return data;
  } catch (error) {
    console.error(`${label} Error:`, error);
    return EMPTY_FC;
  }
}

export async function fetchFemaFloodZones(bbox: BBox): Promise<GeoJSONFeatureCollection> {
  if (!isValidBBox(bbox)) return EMPTY_FC;
  const params = new URLSearchParams({ bbox: bbox.join(",") });
  return fetchGeoJson(`/api/fema-flood-zones?${params}`, "FEMA");
}

export async function fetchIndianaHistoricSites(bbox: BBox): Promise<GeoJSONFeatureCollection> {
  if (!isValidBBox(bbox)) return EMPTY_FC;
  const params = new URLSearchParams({ bbox: bbox.join(",") });
  return fetchGeoJson(`/api/historic-sites?${params}`, "IndianaMap Historic");
}

export async function fetchDnrFloodplain(bbox: BBox): Promise<GeoJSONFeatureCollection> {
  if (!isValidBBox(bbox)) return EMPTY_FC;
  const params = new URLSearchParams({ bbox: bbox.join(",") });
  return fetchGeoJson(`/api/dnr-floodplain?${params}`, "IDNR BAFM");
}

export async function fetchNwsAlerts(): Promise<GeoJSONFeatureCollection> {
  return fetchGeoJson(`/api/nws-alerts`, "NWS Alerts");
}

/** Optional: IndianaMap parcels (Bonebank envelope fallback on server) */
export async function fetchIndianaMapParcels(bbox?: BBox): Promise<GeoJSONFeatureCollection> {
  const params = new URLSearchParams();
  if (bbox && isValidBBox(bbox)) params.set("bbox", bbox.join(","));
  const q = params.toString();
  return fetchGeoJson(`/api/indianamap-parcels${q ? `?${q}` : ""}`, "IndianaMap Parcels");
}
