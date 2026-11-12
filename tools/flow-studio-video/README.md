# Flow Studio 30-second video (source)

Time-driven scene page for the AI Lead Qualifier explainer. `template.html` draws the flow with `render(t)` (no CSS animation), so every frame is deterministic.

Rebuild
1. `npm i @fontsource/ibm-plex-sans playwright` in this folder, then `python3 build.py` (creates `video.html` with the fonts embedded).
2. `node snap.js 1.5 8 14 20` saves stills to `stills/` (create the folder first) for a visual check.
3. `node render.js` writes 750 JPEG frames (25 fps, 30 s) to `frames/`.
4. Add the narration (ElevenLabs, owner's cloned voice, delayed 0.3 s) and encode:
   `ffmpeg -framerate 25 -i frames/%05d.jpg -i narration.mp3 -filter_complex "[1:a]adelay=300|300,apad=whole_dur=30[a]" -map 0:v -map "[a]" -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -t 30 out.mp4`

Timing (scene cut times, captions, bundle keyframes) is in the `ACT`, `BK`, `CHIPS` and `CAPS` arrays, matched to the narration's pauses. Re-time them if the narration changes. Demo project, synthetic data; no unmeasured figures on screen. Brand rule: cyan = operations, purple = AI, amber = risk only.
