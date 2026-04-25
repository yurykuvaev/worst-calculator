# worst-calculator

The worst calculator in the world. Five fully functional calculator versions, each engineered to be as inconvenient as humanly possible. Static site, hosted on **AWS Amplify** with Git auto-deploy.

## The five versions

| # | Name | Why it's awful |
|---|---|---|
| 1 | Slider Calculator | Both operands picked with `0–1000` sliders. ~0.36 px per integer. |
| 2 | Drunk Buttons | Buttons flee the cursor and randomly swap positions. The `=` button is especially anxious. |
| 3 | Roman Numerals | Input/output only in `I V X L C D M`. No Arabic digits anywhere. Negatives say `MINVS`. |
| 4 | Math Riddle | To enter a digit, you must first solve a math problem whose answer is that digit. |
| 5 | Trust Issues | Random 0.4–2.0 s delays, "Are you sure?" modals on every operator, and ~10% of results are off by ±1. |

## Project structure

```
worst-calculator/
├── app/                    Static site (HTML/CSS/vanilla JS, no build step)
│   ├── index.html          Hub with links to all five versions
│   ├── style.css           Shared dark theme
│   └── versions/           One HTML + JS per version
└── amplify.yml             Build spec for AWS Amplify (publishes app/)
```

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
