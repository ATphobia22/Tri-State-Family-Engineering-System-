# Site Provenance — 13101 Bonebank Rd, Point Township, Posey County, IN

**Node ID:** `13101_BONEBANK_RD`  
**Address:** 13101 Bonebank Rd, Mt Vernon, IN 47620  
**Civil Township:** Point Township, Posey County  
**Tri-State context:** Indiana / Illinois / Kentucky confluence (Wabash + Ohio)

## Authoritative coordinates (WGS84 / NAD83)

| Source | Lat | Lon | Notes |
|--------|-----|-----|-------|
| Google Maps pin (user imagery 2026-08) | ≈ 37.830 | ≈ −88.020 | Home marker on Bonebank Rd |
| Street View building label | 37.83°N | −88.02°W | Residential structure + gravel drive |
| USGS proximity | — | — | Gauge 03378500 (Wabash @ New Harmony) ≈ 38.1292, −87.9353 |
| John T. Myers Locks & Dam | ≈ 37.79 | ≈ −87.99 | Downstream Ohio River control structure |

Approximate site elevation (Google / local DEM reference): **~338–352 ft** ground; **LAG 377.2 ft NAVD88** (LiDAR-verified in ArchimedesEngine); **BFE 375.0 ft NAVD88**.

## Regulatory anchors (NAVD88)

- **Lowest Adjacent Grade (LAG):** 377.2 ft NAVD88  
- **Base Flood Elevation (BFE):** 375.0 ft NAVD88  
- **Clearance:** +2.2 ft  
- **Datum transform authority:** NOAA/NGS NCAT (VERTCON 3.0 / GEOID models)  
- **No-Rise threshold:** Indiana 312 IAC 10 (≤ 0.14–0.15 ft surcharge)

## Live data endpoints (zero-key)

| Service | Endpoint in twin | Upstream |
|---------|------------------|----------|
| Datum transform | `GET /api/transform-elevation` | `https://geodesy.noaa.gov/api/ncat/llh` |
| Parcels | `GET /api/indianamap-parcels` | IndianaMap / Posey County ArcGIS REST |
| Best Available Floodplain (BAFM) | `GET /api/indianamap-bafm` / `/api/dnr-floodplain` | IDNR BestAvailableFloodplain + IndianaMap |
| Historic sites | `GET /api/historic-sites` | `maps.indiana.edu` Historic_Sites_IDNR |
| USGS stage/discharge | `GET /api/usgs-telemetry` | NWIS 03378500, 03322000 |
| NWS alerts | `GET /api/nws-alerts` | api.weather.gov area=IN |

## Imagery provenance (user-supplied 2026-08-01)

1. Google Maps search card — 13101 Bonebank Rd Mt Vernon…  
2. Regional context — Wabash / Ohio confluence, Mt Vernon, Uniontown, Shawneetown  
3. Satellite overlay — same region with state boundaries  
4. John T Myers Locks & Dam / Uniontown Dam (Ohio River, KY line)  
5. Street View — residential structure, gravel drive, trees, clear sky  
6. Local road network — Point Township Church of the… proximity  
7. System architecture screenshots (kipi-system six deployments + Tri-State engine list)

All elevations and regulatory outputs must remain **NAVD88-compliant** and carry SHA-256 evidence-chain seals via ArchimedesEngine.

## Next hardening

1. Wire NCAT response fields (`outOrthoHt`, `vertShift`, `vertUncertainty`) into ScientificProofOverlay.  
2. Cache IndianaMap parcel polygons for Section 35 / Bonebank envelope.  
3. Re-run CI once private-repo Actions runner quota is restored.
