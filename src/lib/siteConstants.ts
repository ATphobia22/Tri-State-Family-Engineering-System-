/**
 * Point Township Digital Twin — canonical site constants
 * Derived from user-supplied Google Maps / Street View imagery (2026-08)
 * and ArchimedesEngine regulatory anchors (NAVD88).
 */

export const BONEBANK_SITE = {
  nodeId: "13101_BONEBANK_RD",
  address: "13101 Bonebank Rd, Mt Vernon, IN 47620",
  county: "Posey",
  township: "Point Township",
  state: "IN",
  /** Approximate WGS84 from map pin + Street View */
  lat: 37.83,
  lon: -88.02,
  /** Local ground reference (approx) */
  groundElevFtApprox: 338,
  /** Regulatory (NAVD88) — hard anchors */
  lagFtNavd88: 377.2,
  bfeFtNavd88: 375.0,
  clearanceFt: 2.2,
  /** Nearby controls */
  usgsGauges: [
    { id: "03378500", name: "Wabash River at New Harmony, IN", lat: 38.1292, lon: -87.9353 },
    { id: "03322000", name: "Ohio River at Uniontown Dam, IN", lat: 37.7948, lon: -87.9945 }
  ],
  myersLocksApprox: { lat: 37.79, lon: -87.99, name: "John T Myers Locks & Dam" },
  /** Bounding box for GIS queries (degrees) — ~2 km envelope */
  envelopeBbox: [-88.04, 37.81, -88.00, 37.85] as [number, number, number, number]
} as const;

export type BonebankSite = typeof BONEBANK_SITE;
