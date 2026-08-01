/**
 * NOAA/NGS NCAT (Coordinate Conversion and Transformation Tool) client
 * Official API: https://geodesy.noaa.gov/api/ncat/llh
 * Docs: https://geodesy.noaa.gov/web_services/ncat/lat-long-height-service.shtml
 *
 * Zero-key, public web service. All orthometric heights treated as NAVD88
 * for Point Township regulatory packages.
 */

export interface NcatTransformRequest {
  lat: number;
  lon: number;
  /** Orthometric height in feet (will be converted to meters for API) */
  orthoHtFt: number;
  inVertDatum?: string;  // e.g. "navd88", "ngvd29"
  outVertDatum?: string; // e.g. "navd88"
  inDatum?: string;      // horizontal, e.g. "NAD83(2011)"
  outDatum?: string;
}

export interface NcatTransformResult {
  success: boolean;
  input: { lat: number; lon: number; height_ft: number; datum: string };
  output: {
    height_ft: number;
    datum: string;
    shift_ft: number;
    uncertainty_m: number;
  };
  meta: {
    src: string;
    engine: string;
    raw?: unknown;
  };
  error?: string;
  fallback_shift_ft?: number;
}

const FT_TO_M = 0.3048;
const M_TO_FT = 1 / FT_TO_M;

/** Approximate VERTCON-style shift for Posey County (ft) when NCAT unreachable */
const POSEY_FALLBACK_SHIFT_FT = -0.53;

export async function transformElevation(req: NcatTransformRequest): Promise<NcatTransformResult> {
  const inVert = (req.inVertDatum || "navd88").toLowerCase();
  const outVert = (req.outVertDatum || "navd88").toLowerCase();
  const inHoriz = req.inDatum || "NAD83(2011)";
  const outHoriz = req.outDatum || "NAD83(2011)";
  const heightM = req.orthoHtFt * FT_TO_M;

  // Official NCAT lat-long-height service parameter names (case-sensitive per NGS docs)
  const params = new URLSearchParams({
    lat: String(req.lat),
    lon: String(req.lon),
    orthoHt: String(heightM),
    inDatum: inHoriz,
    outDatum: outHoriz,
    inVertDatum: inVert,
    outVertDatum: outVert
  });

  const url = `https://geodesy.noaa.gov/api/ncat/llh?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(url, {
      headers: { "User-Agent": "PTDT-v34-NCAT-Bridge (admin@pointtownship.gov)" },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NCAT HTTP ${response.status}`);
    }

    const data: any = await response.json();
    if (data.error) {
      throw new Error(String(data.error));
    }

    const outHeightM = parseFloat(data.outOrthoHt ?? data.orthoHt ?? String(heightM));
    const shiftM = parseFloat(data.vertShift ?? "0");
    const uncertaintyM = parseFloat(data.vertUncertainty ?? "0.02");

    return {
      success: true,
      input: {
        lat: req.lat,
        lon: req.lon,
        height_ft: req.orthoHtFt,
        datum: inVert
      },
      output: {
        height_ft: Math.round(outHeightM * M_TO_FT * 1000) / 1000,
        datum: outVert,
        shift_ft: Math.round(shiftM * M_TO_FT * 1000) / 1000,
        uncertainty_m: uncertaintyM
      },
      meta: {
        src: "NGS NCAT / VERTCON 3.0",
        engine: "NOAA/NGS Official Web Service",
        raw: data
      }
    };
  } catch (err: any) {
    return {
      success: false,
      input: {
        lat: req.lat,
        lon: req.lon,
        height_ft: req.orthoHtFt,
        datum: inVert
      },
      output: {
        height_ft: req.orthoHtFt + POSEY_FALLBACK_SHIFT_FT,
        datum: outVert,
        shift_ft: POSEY_FALLBACK_SHIFT_FT,
        uncertainty_m: 0.15
      },
      meta: {
        src: "LOCAL_FALLBACK_POSEY_COUNTY",
        engine: "PTDT offline VERTCON approximation"
      },
      error: err?.message || String(err),
      fallback_shift_ft: POSEY_FALLBACK_SHIFT_FT
    };
  }
}
