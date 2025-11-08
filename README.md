```markdown
# Numb — Lyrics Visualizer

A small static web page that displays the lyrics for "Numb" (Linkin Park) and highlights each line in sync with the song using embedded timecodes (LRC-style). This project is dedicated to Linkin Park fans who want a simple local lyrics visualizer.

Features
- Precise timestamps embedded for every lyric line (data-start attributes).
- The currently playing lyric line glows.
- Smooth auto-scrolling so the active lyric stays centered.
- Push-button toggle to enable/disable auto-scrolling; the preference is saved in localStorage.
- Click any lyric line to seek the audio to that line.

How to use
1. Place `index.html`, `styles.css`, `main.js`, and `song.mp3` (your copied audio file) in the same folder.
2. Open `index.html` in a modern desktop browser (Chrome, Firefox).
3. Press Play. The lyrics will highlight according to the timestamps.
4. Use the "Auto-scroll" button to toggle automatic scrolling on or off.
5. Click a lyric line to jump to its timestamp.

Notes & Licensing
- This project is intended as a fan tool and demonstration. Ensure you have the appropriate rights to use any audio file (`song.mp3`) you load locally.
- You can edit the `data-start` attributes to tweak the timings or create/export your own LRC files (the previous recording UI was removed; timestamps are now static).
