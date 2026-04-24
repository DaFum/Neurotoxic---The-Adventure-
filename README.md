# NEUROTOXIC: Grind The Void

Ein 2.5D-Adventure über die Band **NEUROTOXIC** und ihre Abenteuer — von der Probe bis in die Leere des Alls. Begleite die Band auf ihrer epischen Reise durch Musik und Mysterien.

## Warum dieses Projekt

Das Projekt kombiniert Retro-Adventure-Elemente mit moderner 2.5D-Grafik und einem tiefen Dialogsystem. Es bietet eine einzigartige Erzählung, kombiniert mit Quests, Item-Management und einem dynamischen Band-Mood-System, das den Spielverlauf beeinflusst.

## Inhaltsverzeichnis

- [Warum dieses Projekt](#warum-dieses-projekt)
- [Spielen](#spielen)
- [Lokal starten](#lokal-starten)
- [Build](#build)
- [Tech-Stack](#tech-stack)
- [Links](#links)
- [Lizenz](#lizenz)

## Spielen

Das Spiel läuft im Browser. Erkunde Szenen, rede mit NPCs, sammle Items und löse Quests, um die Band zusammenzuhalten.

**Szenen:** Proberaum · Tourbus · Backstage · Void Station · Kaminstube · Salzgitter

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org/) (v18+)

```bash
# Repository klonen und Abhängigkeiten installieren
git clone https://github.com/DaFum/Neurotoxic---The-Adventure-
cd Neurotoxic---The-Adventure-
pnpm install

# Entwicklungsserver starten
pnpm run dev
```

Der Dev-Server startet auf `http://localhost:3000`.

## Build

```bash
pnpm run build    # Erstellt einen Production-Build in dist/
pnpm run preview  # Vorschau des Builds
```

## Tech-Stack

- **React 19** + **TypeScript** — UI & Logik
- **Three.js** (react-three-fiber / drei) — 3D-Rendering
- **Rapier** (react-three-rapier) — Physik
- **Zustand** — State Management (persistiert im LocalStorage)
- **Tailwind CSS 4** — Styling
- **Vite** — Bundler & Dev-Server

## Links

- [Mitwirken (Contributing)](CONTRIBUTING.md)
- [Verhaltenskodex (Code of Conduct)](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)
- [Dokumentation](docs/README.md)

## Lizenz

Apache-2.0
