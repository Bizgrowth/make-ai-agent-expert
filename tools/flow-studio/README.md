# Make Flow Studio

A single-file teaching tool: animated flow diagrams of Make scenarios with app icons, a bundle that travels along the lines, routing, an SOP of phases, and a chart of real execution runs.

## Use it
1. Open `index.html` in any browser (double-click it). No install or server needed. Fonts load from Google Fonts; if offline it falls back to system fonts.
2. Pick a scenario on the top rail, pick a run in the menu, press Play, Step or click a bubble. Space plays/pauses, right arrow steps, R resets. "Presenter view" enlarges the canvas.

## Where the data lives
Everything is inside `index.html` in the `<script>` block:
- `APPS` and `GLYPH`: app names, colours and the drawn icons.
- `PHASES`: the seven SOP phases and talk-track lines.
- `S.<id>`: one object per scenario (nodes with x/y position, edges, scripts of steps, sample data). Add a scenario by copying one, then add its id to `ORDER`.
- `RUNS`: the recorded executions shown in the "Real runs" tab (snapshot from Make, 2026-10-18).

Data is a snapshot. To refresh it, ask the agent to re-read Make and update `S` and `RUNS`.

## Notes
- Icons are simplified drawings, not official brand logos.
- Operation counts are illustrative except where a scenario note says "Measured".
