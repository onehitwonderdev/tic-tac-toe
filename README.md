# Tic-Tac-Toe

A responsive, local two-player Tic-Tac-Toe game built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Interactive 3 × 3 board for X and O
- Alternating turns, all eight win patterns, and draw detection
- Guards against moves in occupied squares or after the game ends
- Winning-line highlight and clear live game status
- One-button restart at any time
- Keyboard play with arrow-key navigation and Enter/Space to place a mark
- Responsive dark interface with reduced-motion support

## Tech stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS 4
- Lucide React icons

## Requirements

- Node.js 22 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The game runs entirely in the browser and needs no account or backend service.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

The game-rule tests cover every winning line for both players, turns, invalid moves, draws, completed games, restart behavior, and status messages.

## Deploy

The application is deployed on Vercel: [tic-tac-toe-kohl-beta.vercel.app](https://tic-tac-toe-kohl-beta.vercel.app/).

To build and run the production server locally:

```bash
npm run build
npm start
```

The app is deployed on Vercel, which supports Next.js deployments.
