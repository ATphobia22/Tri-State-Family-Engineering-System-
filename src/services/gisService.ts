import * as THREE from 'three';

export interface GeoJSONFeature {
  type: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export async function fetchFemaFloodZones(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `/api/fema-flood-zones`;
  const params = new URLSearchParams({
    bbox: bbox.join(',')
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch FEMA data');
    return await res.json();
  } catch (error) {
    console.error("FEMA API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}

export async function fetchIndianaHistoricSites(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `/api/historic-sites`;
  const params = new URLSearchParams({
    bbox: bbox.join(',')
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch INMap data');
    return await res.json();
  } catch (error) {
    console.error("INMap API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}

export async function fetchDnrFloodplain(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `/api/dnr-floodplain`;
  const params = new URLSearchParams({
    bbox: bbox.join(',')
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch Indiana DNR floodplain');
    return await res.json();
  } catch (error) {
    console.error("DNR Floodplain API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}

/** IndianaMap parcels (statewide / Posey harvest) */
export async function fetchIndianaMapParcels(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `/api/indianamap-parcels`;
  const params = new URLSearchParams({ bbox: bbox.join(',') });
  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch IndianaMap parcels');
    return await res.json();
  } catch (error) {
    console.error("IndianaMap parcels Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}

/** Best Available Floodplain via IndianaMap/IDNR */
export async function fetchIndianaMapBafm(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `/api/indianamap-bafm`;
  const params = new URLSearchParams({ bbox: bbox.join(',') });
  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch BAFM');
    return await res.json();
  } catch (error) {
    console.error("BAFM Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}

/** NCAT datum transform (feet in/out, NAVD88 default) */
export async function transformElevationNcat(opts: {
  lat: number;
  lon: number;
  heightFt: number;
  inVertDatum?: string;
  outVertDatum?: string;
}): Promise<any> {
  const params = new URLSearchParams({
    lat: String(opts.lat),
    lon: String(opts.lon),
    height: String(opts.heightFt),
    inVertDatum: opts.inVertDatum || 'navd88',
    outVertDatum: opts.outVertDatum || 'navd88'
  });
  const res = await fetch(`/api/transform-elevation?${params.toString()}`);
  return res.json();
}

export async function fetchNwsAlerts(): Promise<any> {
  const url = `/api/nws-alerts`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch NWS alerts');
    return await res.json();
  } catch (error) {
    console.error("NWS API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}
