resource "aws_amplify_app" "worst_calculator" {
  name        = "worst-calculator"
  description = "The worst calculator in the world. Manual deploys via GitHub Actions + OIDC."

  # No `repository` and no `access_token`. The app runs in manual-deploy mode:
  # GitHub Actions uploads a zip via amplify:CreateDeployment / StartDeployment.
  # Build spec is what Amplify runs on the uploaded zip — for static files,
  # it just publishes everything as-is.
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        build:
          commands:
            - echo "Static site - no build step"
      artifacts:
        baseDirectory: /
        files:
          - '**/*'
      cache:
        paths: []
  EOT

  tags = {
    Name        = "worst-calculator"
    Environment = var.environment
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.worst_calculator.id
  branch_name = "main"

  stage             = "PRODUCTION"
  enable_auto_build = false

  tags = {
    Name        = "worst-calculator-main"
    Environment = var.environment
  }
}

# GitHub OIDC provider already exists in the account (created by rails-aws-platform).
# Account-global resource — there can only be one per provider URL — so we look it up.
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "github_deploy" {
  name = "worst-calculator-github-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Federated = data.aws_iam_openid_connect_provider.github.arn }
        Action    = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:ref:refs/heads/main"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "worst-calculator-github-deploy"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy" "github_deploy_amplify" {
  name = "worst-calculator-deploy-amplify"
  role = aws_iam_role.github_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "amplify:CreateDeployment",
          "amplify:StartDeployment",
          "amplify:GetJob"
        ]
        Resource = "${aws_amplify_app.worst_calculator.arn}/branches/${aws_amplify_branch.main.branch_name}/*"
      }
    ]
  })
}
