# worst-calculator

The worst calculator in the world. Five fully functional calculator versions, each engineered to be as inconvenient as humanly possible. Static site, hosted on **AWS Amplify** with Git auto-deploy. The default page is **Drunk Buttons** — switch versions with the `1 2 3 4 5` row at the top.

## The five versions

| # | URL | Name | Why it's awful |
|---|---|---|---|
| 1 | `/slider.html` | Slider Calculator | Both operands picked with `0–1000` sliders. ~0.36 px per integer. |
| 2 | `/` (default) | Drunk Buttons | Buttons flee the cursor and randomly swap positions. The `=` button is especially anxious. |
| 3 | `/roman.html` | Roman Numerals | Input/output only in `I V X L C D M`. No Arabic digits anywhere. Negatives say `MINVS`. |
| 4 | `/riddle.html` | Math Riddle | To enter a digit, you must first solve a math problem whose answer is that digit. |
| 5 | `/trust.html` | Trust Issues | Random 0.4–2.0 s delays, "Are you sure?" modals on every operator, and ~10% of results are off by ±1. |

## Project structure

```
worst-calculator/
├── app/
│   ├── index.html      Drunk Buttons (default landing)
│   ├── slider.html     v1
│   ├── roman.html      v3
│   ├── riddle.html     v4
│   ├── trust.html      v5
│   ├── style.css       Shared dark theme + topbar/switcher
│   ├── drunk.js
│   ├── slider.js
│   ├── roman.js
│   ├── riddle.js
│   └── trust.js
└── amplify.yml         Build spec for AWS Amplify (publishes app/)
```

Every page renders the same topbar with five small square buttons (`1 2 3 4 5`). The active version is highlighted; clicking any other number jumps to that calculator.

## Local development

It's just static files. Open `app/index.html` directly, or run any local web server:

```powershell
cd app
python -m http.server 8000
# then visit http://localhost:8000
```

No build step. No Node. No bundler.

## Hosting

Hosted on **AWS Amplify**, connected to this GitHub repo. Every push to `main` triggers a fresh deployment automatically — Amplify pulls, runs `amplify.yml`, and serves `app/**/*` behind CloudFront with a managed cert.
