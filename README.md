# worst-calculator

The worst calculator in the world. Five fully functional calculator versions, each engineered to be as inconvenient as humanly possible. Static site, hosted on **AWS Amplify** (manual deploy mode), deployed on every push to `main` via **GitHub Actions + OIDC** — no PATs or long-lived secrets anywhere.

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
├── infra/                  Terraform: Amplify app + branch + IAM OIDC role
└── .github/workflows/      deploy.yml — zip app/, push to Amplify via OIDC
```

## Local development

It's just static files. Open `app/index.html` directly, or run any local web server:

```powershell
cd app
python -m http.server 8000
# then visit http://localhost:8000
```

No build step. No Node. No bundler.

## Deploy to AWS

### How it works

1. Terraform creates an Amplify app in **manual deploy mode** (no Git connection) and an IAM role that GitHub Actions can assume via OIDC, scoped to deploys on this Amplify app only.
2. On push to `main`, GitHub Actions:
   - Assumes the IAM role via OIDC (no AWS keys, no PAT).
   - Zips `app/`.
   - Calls `aws amplify create-deployment` → uploads zip to the returned presigned URL → calls `aws amplify start-deployment`.
   - Polls `aws amplify get-job` until `SUCCEED` / `FAILED`.
3. Amplify serves the result on `https://main.<app-id>.amplifyapp.com` with a managed cert + CloudFront edge caching.

### 1. Provision

```powershell
cd infra
terraform init
terraform apply
```

### 2. Add three GitHub secrets

`Settings → Secrets and variables → Actions → New repository secret`:

| Secret | Source |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | `terraform output -raw github_deploy_role_arn` |
| `AWS_REGION`          | `us-east-1` |
| `AMPLIFY_APP_ID`      | `terraform output -raw amplify_app_id` |

### 3. Push

```bash
git push origin main
```

Workflow runs (~1 min). When it's green:

```bash
terraform output amplify_default_domain
# → https://main.dXXXXXXXXXXXX.amplifyapp.com
```

## Cleanup

```bash
cd infra
terraform destroy
```

Removes the Amplify app, all deployment history, and the IAM role.
