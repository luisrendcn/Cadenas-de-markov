# Markov Chain Desktop Suite

Interactive solver for transition matrices, convergence, and steady-state analysis.

## Install the desktop app

Download the latest Windows installer:

[Download Markov Chain Desktop Suite Setup](https://github.com/luisrendcn/Cadenas-de-markov/releases/latest/download/Markov-Chain-Desktop-Suite-Setup-1.0.0.exe)

Scan this QR code to install the desktop app:

![QR code to install Markov Chain Desktop Suite](assets/install-qr.svg)

Windows may show a SmartScreen warning because this is an unsigned app. If you trust the source, choose **More info** and then **Run anyway**.

## What is included

- Electron desktop shell.
- Local Node Express API for all mathematical computation.
- Dynamic transition matrix editor for any square matrix size.
- Initial vector, iteration count, custom state names, and optional cost/revenue inputs.
- Matrix powers, state evolution, stationary distribution, heatmap, convergence chart, pie chart, CSV export, and PDF export.

## API endpoints

- `POST /compute/powers` returns `P^1` through `P^n`.
- `POST /compute/evolution` returns `v_n = v_0 * P^n`.
- `POST /compute/stationary` returns a stationary distribution.
- `POST /compute/costs` returns expected per-step and cumulative cost/revenue values.
- `POST /compute/all` returns every calculation in one JSON payload.

Example request body:

```json
{
  "matrix": [[0.7, 0.2, 0.1], [0.25, 0.5, 0.25], [0.15, 0.25, 0.6]],
  "vector": [1, 0, 0],
  "iterations": 10,
  "costs": [12, 9, 15],
  "stateNames": ["Netflix", "Disney+", "Prime Video"]
}
```

## Run locally

For developers, clone the repository and install dependencies:

Install dependencies:

```bash
npm install
```

Start the desktop app:

```bash
npm start
```

The Electron app starts the local API automatically on `127.0.0.1` using an available port.

Run only the API for testing:

```bash
npm run api
```

Smoke test the computation module:

```bash
npm run smoke
```

Build a shareable Windows executable:

```bash
npm run dist
```

Build a Windows installer:

```bash
npm run dist:installer
```

## Project structure

```text
src/
  api/
    markov.js       Mathematical engine and validation
    server.js       Express API endpoints
  electron/
    main.js         Electron lifecycle, API startup, exports
    preload.js      Secure renderer bridge
  renderer/
    index.html      Desktop UI
    styles.css      Glassmorphism UI styling
    app.js          Editor, API calls, charts, exports
```

## Notes

- The app is offline after dependencies are installed.
- CSV export writes a structured report with input matrix, evolution, stationary distribution, costs, and powers.
- PDF export uses Electron's native `printToPDF`, so it captures the current application view.
