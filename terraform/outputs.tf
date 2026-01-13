# Output the API Gateway endpoint URL
output "api_gateway_url" {
  description = "The base URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.bookstore_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_deployment.bookstore_api_deployment.stage_name}"
}

# Output the full books endpoint URL
output "books_api_url" {
  description = "The full URL for the /books endpoint"
  value       = "https://${aws_api_gateway_rest_api.bookstore_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_deployment.bookstore_api_deployment.stage_name}/books"
}

# Output the S3 bucket website URL
output "s3_bucket_website_url" {
  description = "The website URL for the S3 bucket"
  value       = "http://${aws_s3_bucket.bookstore_bucket.bucket}.s3-website-${data.aws_region.current.name}.amazonaws.com"
}

# Output the S3 bucket name
output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.bookstore_bucket.bucket
}
