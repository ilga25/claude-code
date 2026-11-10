# Dinero Claro USA · Vídeo 1 — Seguro Social 2027

Vídeo explicativo animado (~10 min, 1920×1080 @ 60 fps, render 4K) hecho con Remotion + React + TypeScript a partir de `guion.md`.

## Requisitos

Node.js 18+ y FFmpeg. `npm install`.

## Flujo

| Paso | Comando |
| --- | --- |
| Sin voz todavía: tiempos estimados (145 palabras/min) | `npm run timeline:estimate` |
| Con voz: pon `voz.mp3` (y opcional `musica.mp3`, `sfx/whoosh.*`, `sfx/pop.*`, `sfx/click.*`) en la raíz | `npm run audio:prepare` (normaliza la voz a −14 LUFS) |
| Sincroniza con whisper.cpp (descarga whisper y el modelo la primera vez) | `npm run timeline:whisper` (o `-- --model large-v3`) |
| Vista previa interactiva | `npm run studio` |
| Fotogramas de revisión (3 por escena) | `npm run stills` |
| Render final: 4K H.264 + miniatura + Short + SRT | `npm run render` |
| Igual, más el máster ProRes 4444 (>100 GB) | `npm run render -- --master` |
| Vista previa rápida a 1080p | `npm run render -- --hd` |

El render es reanudable: va por bloques en `out/parts/` y salta los que ya existen. Si cambias el timeline, borra `out/parts/`.

Si Chrome no se descarga en tu máquina, apunta a uno instalado: `REMOTION_CHROME=/ruta/a/chrome npm run render`.

## Sincronización

`src/data/transcript.json` tiene cada palabra del guion con su tiempo y `src/data/timeline.json` el inicio y el final de cada escena. Con la voz real, `timeline:whisper` alinea la transcripción de Whisper con el guion palabra a palabra, así que el texto en pantalla conserva la ortografía del guion. Las animaciones se disparan con `useWordFrame("palabra", escena)` (`src/lib/timing.ts`): basta con regenerar el timeline para que todo se vuelva a sincronizar.

## Estructura

- `src/theme.ts`: colores, tipografías (Montserrat 800/900 e Inter 400/600, incluidas en `public/fonts`), rejilla y curvas de animación.
- `src/data/facts.ts`: todas las cifras que salen en pantalla, en un solo sitio.
- `src/components/`: Counter, KineticText, BarChart, Card3D, Checklist, Character (Rosa y Miguel), Subtitles, Camera, Background, Props…
- `src/scenes/Escena1…10.tsx` + `EndScreen.tsx` (20 s).
- `src/Short.tsx` (vertical, escenas 4 y 5) · `src/Thumbnail.tsx`.

## Antes de publicar

- La prima de la Parte B de 2027 ($209.50) es una **proyección**: cuando salga la oficial, cámbiala en `src/data/facts.ts`, en `guion.md`, y regenera el timeline.
