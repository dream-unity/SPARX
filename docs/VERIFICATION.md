# Verification record

Date: 25 October 2026.

## Automated checks

`npm run check` validates the four application modules. `npm test` runs seven Node tests covering:

- Full ten-chapter progression: three unique waypoints and reflection required for each unlock.
- Save/reload of a partially completed chapter.
- Malformed, oversized and future-version state; duplicate and invalid trial indices; forged completion flags.
- Unavailable storage and malformed stored JSON, without a game crash.
- Ten curriculum entries, thirty reachable activities, and explicit extension flags.
- Movement to and interaction with every one of the thirty world waypoints, plus scene drawing and completion states.
- Pause, keyboard exclusion for forms/dialogs, touch direction and cleanup.

The world tests use a mock browser/canvas context. They check behaviour and geometry, not visual appearance or real GPU performance.

## Browser verification

A real Chromium browser completed all thirty activities across all ten chapters through the visible interface. This included every activity type, sequence reordering, categorisation, choice/plan responses, the breathing alternative, reflections, all chapter unlocks and the final ten-entry journal.

Additional checks covered incomplete-answer feedback, an incorrect response and retry, guidance labelling, saved chapter recovery after page reload, optional plan persistence and journal note persistence. The timed breathing exercise completed in the mobile viewport. Export, reset and reimport of a complete ten-chapter journey were verified through the browser interface. Desktop layout was visually inspected. A same-origin iframe with a 390 × 844 CSS viewport was used to inspect the responsive phone layout and activity dialogs; this is responsive-layout testing, not physical-device testing.

Review identified and corrected a breathing reduced-motion issue, end-of-list keyboard focus loss, a stale asynchronous import result and an instruction-card overlap near the tablet breakpoint. Device reduced-motion preferences override optional ambient motion. The app includes no flashing effects.

Browser-extension metadata errors were observed independently of the app; they were not game errors.

## Limits

This is a first playable educational prototype. Testing does not establish clinical efficacy, therapeutic equivalence to SPARX, psychological competence measurement, complete screen-reader compatibility or performance on every phone/browser. No physical Android/iOS device test or participant study was performed. Import sanitisation and storage failures have automated coverage; every possible browser file-picker and quota behaviour has not been exercised.

See RESEARCH.md for the distinction between software verification and clinical/content evaluation.
