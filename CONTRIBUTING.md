# Contributing

Thanks for helping improve Battleship!

## Prerequisites
- Node.js 18+
- npm (bundled with Node)
- For mobile: Xcode (iOS) or Android Studio/SDKs if you plan to run on devices/simulators.

## Getting Started
```bash
# Install dependencies
npm install --prefix web
npm install --prefix BattleshipMobile

# Run web locally
npm run dev --prefix web

# Lint mobile
npm run lint --prefix BattleshipMobile
```

## Pull Requests
- Create a feature branch off `master`.
- Keep changes small and focused; include tests or screenshots when relevant.
- Ensure lint/build passes (`npm run build --prefix web`, `npm run lint --prefix BattleshipMobile`).
- Describe the change and any risk areas in the PR body.

## Reporting Issues
Open a GitHub issue with clear steps to reproduce, expected vs actual behavior, and environment details (OS, browser/device, build).
