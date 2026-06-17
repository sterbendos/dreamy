# TODO

## Export pipeline redo (dreamy-classic parity)
- [ ] Import dreamy-classic source into `vendor/dreamy-classic/`.
- [ ] Identify dreamy-classic export pipeline entrypoints (video encode, audio/subtitles muxing, effect rendering model).
- [ ] Decide integration approach:
  - [ ] Implement via dreamy-classic Rust/native backend (fastest/most reliable for NVENC).
  - [ ] JS-side orchestrator only if native backend is not portable.
- [ ] Port exporter integration into `src/lib/render/Exporter.ts` (or new module) and keep legacy interfaces (`TimelineState`, b-rolls, transcript, captionStyle, effects).
- [ ] Add progress + diagnostics.
- [ ] Test exports:
  - [ ] MP4 (with/without subtitles)
  - [ ] Long timelines (latency/timeout robustness)
- [ ] Confirm GPU encoder usage (NVENC/Hardware) using dreamy-classic’s mechanism.

