---
name: motion-graphics-generator
description: Generate declarative JSON or React-based motion graphics (Lottie, Remotion, or custom WebGL) for video timeline integration. Use this skill when asked to create intros, lower thirds, or kinetic typography overlays for Dreamy video projects.
---

# Motion Graphics Generation

When creating motion graphics for Dreamy, follow these guidelines to ensure the output is performant, professional, and easily rendered by the core web-native engine.

## Core Philosophy
1. **Declarative First**: Always output graphics as a declarative data structure (e.g., a JSON schema or structured React component) rather than pre-rendered binary video. This allows the Dreamy WebGL/WASM engine to composite it in real-time.
2. **Minimal & Professional**: Avoid generic "PowerPoint-style" wipes and bounces. Aim for smooth, easing-driven motion (e.g., cubic-bezier easing `[0.16, 1, 0.3, 1]`) similar to high-end television graphics.
3. **Typography**: Use bold, high-contrast typography. Adhere to the project's font stack (e.g., Fraunces for display, Plus Jakarta Sans for body).

## Supported Formats

### 1. JSON Keyframe Schema (Preferred for WebGL)
When generating graphics for the native compositor, use our internal JSON schema.

```json
{
  "type": "kinetic_text",
  "text": "Breaking News",
  "font": "Fraunces",
  "style": { "color": "#FFFFFF", "fontSize": 120, "weight": "bold" },
  "animations": [
    {
      "property": "opacity",
      "keyframes": [
        { "time": 0, "value": 0 },
        { "time": 0.5, "value": 1, "easing": "easeOutExpo" },
        { "time": 4.5, "value": 1 },
        { "time": 5, "value": 0, "easing": "easeInExpo" }
      ]
    },
    {
      "property": "translateY",
      "keyframes": [
        { "time": 0, "value": 50 },
        { "time": 0.8, "value": 0, "easing": [0.16, 1, 0.3, 1] }
      ]
    }
  ]
}
```

### 2. Remotion / React (Preferred for DOM-based overlays)
If generating DOM-based graphics that will be recorded via `<canvas>`, use Framer Motion or Remotion primitives.

## Principles of Good Motion
- **Anticipation**: A small backward movement before a large forward movement.
- **Follow Through**: Elements should slightly overshoot their target and settle.
- **Staggering**: If multiple elements (e.g., words in a sentence) appear, stagger their entrance by `0.05s` to `0.1s` for a fluid, cascaded look.

## Execution Steps
1. Parse the user's prompt (e.g., "Create a moody lower third for John Doe, CEO").
2. Determine the color palette based on the prompt (e.g., "moody" = dark backgrounds, desaturated accents).
3. Output the exact JSON or React component code required to render it. Do NOT output pseudocode.
