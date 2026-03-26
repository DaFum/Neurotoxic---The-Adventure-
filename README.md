# NEUROTOXIC: Grind The Void

Ein 2.5D-Adventure über die Band **NEUROTOXIC** und ihre Abenteuer — von der Probe bis in die Leere des Alls.

## Spielen

Das Spiel läuft im Browser. Erkunde Szenen, rede mit NPCs, sammle Items und löse Quests, um die Band zusammenzuhalten.

**Szenen:** Proberaum · Tourbus · Backstage · Void Station · Kaminstube · Salzgitter

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org/) (v18+)

```bash
npm install
npm run dev
```

Der Dev-Server startet auf `http://localhost:3000`.

## Build

```bash
npm run build    # Erstellt einen Production-Build in dist/
npm run preview  # Vorschau des Builds
```

## Tech-Stack

- **React 19** + **TypeScript** — UI & Logik
- **Three.js** (react-three-fiber / drei) — 3D-Rendering
- **Rapier** (react-three-rapier) — Physik
- **Zustand** — State Management (persistiert im LocalStorage)
- **Tailwind CSS 4** — Styling
- **Vite** — Bundler & Dev-Server

## Lizenz

Apache-2.0
