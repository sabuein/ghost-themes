1) Start the server:
   ```
   npm install
   npm run start
   ```

2) In your PWA:
   import { createBeacon } from "./src/beaconClient.js";
   const beacon = createBeacon({ endpoint: "http://localhost:3001/log", getContext: () => ({ app: "demo" }) });
   beacon.event("hello", { who: "world" });

3) Check ./logs/beacons-YYYY-MM-DD.log for newline-delimited JSON records.