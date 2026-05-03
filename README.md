# worst-calculator

The worst calculator in the world. Buttons flee the cursor and randomly
swap positions. The `=` button is especially anxious. Static site, hosted
on **AWS Amplify** with Git auto-deploy.

**Live:** [calculator.yurykuvaev.com](https://calculator.yurykuvaev.com/). Try pressing `=`.

## Project structure

```
worst-calculator/
├── app/
│   ├── index.html      Drunk Buttons (the calculator)
│   ├── style.css       Light theme, pill-shaped buttons
│   └── drunk.js        The chaos
└── amplify.yml         Build spec for AWS Amplify (publishes app/)
```

## Local development

It's just static files. Open `app/index.html` directly, or run any local
web server:

```powershell
cd app
python -m http.server 8000
# then visit http://localhost:8000
```

No build step. No Node. No bundler.

## Hosting

Hosted on **AWS Amplify**, connected to this GitHub repo. Every push to
`main` triggers a fresh deployment automatically: Amplify pulls, runs
`amplify.yml`, and serves `app/**/*` behind CloudFront with a managed cert.
The custom domain is wired in Amplify Console.
