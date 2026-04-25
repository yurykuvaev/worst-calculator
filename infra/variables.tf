variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "project_name" {
  type    = string
  default = "worst-calculator"
}

variable "github_repo" {
  type    = string
  default = "yurykuvaev/worst-calculator"
}
