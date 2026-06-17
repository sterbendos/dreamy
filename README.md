# Dreamy

Dreamy is a powerful, privacy-first, web-native video editor. Built on a blazing-fast Rust and WebAssembly (WASM) architecture, Dreamy runs directly in your browser without requiring you to upload your videos to the cloud.

Our goal is to provide a simple, intuitive, and highly capable editing experience that rivals desktop applications, accessible entirely from the web.

## Features

- **Privacy First**: Your videos never leave your device. All processing is done locally in your browser.
- **Auto-Cut**: Automatically detect and remove silence from your clips using web-native audio analysis.
- **Auto-Subtitles**: Fast and accurate caption generation running locally.
- **Web-Native Rendering**: Leveraging WebCodecs, WebGL/WebGPU, and WASM for high-performance timeline scrubbing and exporting.
- **Hardware Acceleration**: Built to utilize local GPU capabilities whenever available (Mac, Nvidia).

## Project Architecture

Dreamy uses a monorepo structure designed for flexibility and cross-platform potential:

- `apps/web/`: The Next.js web application frontend. This is the primary interface for Dreamy.
- `rust/`: The single source of truth for our non-UI code. It handles the GPU compositor, video effects, masks, and WASM bindings. All core logic is platform-agnostic.

## Getting Started

To run Dreamy locally for development:

### Prerequisites

- [Bun](https://bun.sh/docs/installation)
- [Rust toolchain](https://rustup.rs/) (if you plan to edit the core engine)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sterbendos/dreamy.git
   cd dreamy
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Start the development server:**
   ```bash
   bun dev:web
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Compiling the WASM Engine

If you are modifying the core Rust engine (`rust/` directory) and need to rebuild the WASM bindings for the web app:

1. Install `wasm-pack`:
   ```bash
   cargo install wasm-pack
   ```

2. Build the local WASM package:
   ```bash
   bun run build:wasm
   ```

3. Rebuild automatically on changes:
   ```bash
   bun dev:wasm
   ```

## Contributing

We welcome contributions! Dreamy is actively evolving, and we are constantly porting advanced features into our web-native architecture. 

If you're looking to help out:
- Focus on the `apps/web/` directory for UI/UX improvements.
- Focus on the `rust/` directory for core performance, video rendering, and WASM integrations.

## License

Copyright (c) 2025–present Dreamy. All Rights Reserved.

This software is proprietary and not open source. Unauthorized copying, distribution, or modification is strictly prohibited. See [LICENSE](LICENSE) for full terms.
