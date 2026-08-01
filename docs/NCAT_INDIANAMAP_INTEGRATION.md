# NCAT + IndianaMap Integration Notes

## Branch: `feature/ncat-indianamap-site-data`

### New modules

| Path | Role |
|------|------|
| `src/lib/siteConstants.ts` | Canonical 13101 Bonebank Rd anchors (lat/lon, LAG/BFE NAVD88) |
| `src/services/ncatService.ts` | Official NGS NCAT `llh` client with Posey fallback |
| `src/services/indianaMapService.ts` | Parcel + BAFM ArcGIS REST clients + offline GeoJSON |
| `src/server-gis-routes.ts` | Express registration for new endpoints |
| `docs/SITE_PROVENANCE_BONEBANK.md` | Imagery + regulatory provenance |

### New HTTP endpoints

```
GET /api/transform-elevation?lat=&lon=&height=&inVertDatum=navd88&outVertDatum=navd88
GET /api/indianamap-parcels?bbox=xmin,ymin,xmax,ymax
GET /api/indianamap-bafm?bbox=...
GET /api/site/bonebank
```

### Wire-up required in `server.ts`

```ts
import { registerGisRoutes } from "./src/server-gis-routes";
// ...
registerGisRoutes(app);
registerAIRoutes(app, getGenAI);
```

(If not yet applied on this branch tip, apply the two-line change before merge.)

### NCAT parameter fix

Legacy route used `in_datum` / `in_ortho_ht` (incorrect).  
Hardened client uses NGS-documented names: `inDatum`, `outDatum`, `orthoHt`, `inVertDatum`, `outVertDatum`.

Docs: https://geodesy.noaa.gov/web_services/ncat/lat-long-height-service.shtml

### IndianaMap exploration

- Historic sites already proxied: `maps.indiana.edu/.../Historic_Sites_IDNR`
- BAFM: `dnrmaps.dnr.in.gov/.../BestAvailableFloodplain`
- Parcels: candidate REST layers under IndianaMap Infrastructure/Cadastre + Posey County GIS; first successful response wins, else Bonebank envelope fallback.

### Site from user imagery (2026-08-01)

Address confirmed: **13101 Bonebank Rd, Mt Vernon, IN 47620**  
Context: Point Township, Ohio/Wabash confluence, John T Myers Locks & Dam downstream.
