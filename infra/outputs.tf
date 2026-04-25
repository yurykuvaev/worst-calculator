output "amplify_app_id" {
  description = "Amplify app ID (used by GitHub Actions to deploy)"
  value       = aws_amplify_app.worst_calculator.id
}

output "amplify_default_domain" {
  description = "Amplify-managed domain (https://<branch>.<app-id>.amplifyapp.com)"
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.worst_calculator.default_domain}"
}

output "amplify_console_url" {
  description = "Amplify console URL for this app"
  value       = "https://${var.aws_region}.console.aws.amazon.com/amplify/home?region=${var.aws_region}#/${aws_amplify_app.worst_calculator.id}"
}

output "github_deploy_role_arn" {
  description = "IAM role ARN GitHub Actions assumes via OIDC"
  value       = aws_iam_role.github_deploy.arn
}
