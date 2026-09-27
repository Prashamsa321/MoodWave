# MoodWave Report UI — Windows 98 pass

This pass intentionally focuses on the **Reports** application before the Models application.

## What changed

- Added `retro-react` to `package.json` (`^1.6.0`).
- Rebuilt the shared application frame with Windows 95/98-style title bars, square bevels, minimize/maximize/close controls, silver chrome and navy title colour.
- Changed the global desktop background/taskbar toward the Windows 98 teal + silver shell so the Reports window sits in the right visual environment.
- Replaced the old accordion-based Findings page with a document-style Reports app.
- The Reports app opens on a **blank white document page**.
- Its menu bar contains **File only**.
- File contains the requested report choices:
  - Mood Emotion
  - Genre
  - Historical Trends
  - Audio Features
  - Popularity Model
  - Mood Classifier
  - Genre Classifier
  - Clustering
  - Cluster Visualization
- Selecting a report renders the corresponding figures and short evidence-based findings in a Word-like page.
- Report content/metrics were taken from the existing project outputs in `moodwave-ml/reports` and `moodwave-ml/models/metadata` rather than inventing new model results.
- Existing figure assets were copied into the new `public/reports/figures/01_...` through `10_...` directory structure.

## Figure availability

Only figures that already exist in this project were copied. Names in the desired directory plan such as `mood_distribution`, `mood_feature_profiles`, and `genre_mood_composition` are not currently present in the supplied ML outputs, so this UI does not fabricate them.

`04_country_global/country_mood_profiles.*` is copied into the new report asset structure, but **Country / Global is not exposed in the File menu** because it was not included in the explicit File-menu list in the brief.

## Install

Run this once in `Frontend/` so npm installs `retro-react` and refreshes `package-lock.json`:

```bash
npm install
```

Then run:

```bash
npm run dev
```
