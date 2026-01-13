# Create an S3 bucket with unique name
# Using account ID and region to ensure uniqueness
data "aws_caller_identity" "current" {}

locals {
  # Create a unique suffix based on account ID and region
  # Note: data.aws_region.current is defined in api_gateway.tf
  bucket_suffix = substr(md5("${data.aws_caller_identity.current.account_id}-${data.aws_region.current.name}"), 0, 8)
  
  # Compute the API Gateway URL dynamically
  api_url = "https://${aws_api_gateway_rest_api.bookstore_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_deployment.bookstore_api_deployment.stage_name}/books"
}

resource "aws_s3_bucket" "bookstore_bucket" {
  bucket = "social-club-bookstore-${local.bucket_suffix}"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

# Configure public access block (allowing public access)
resource "aws_s3_bucket_public_access_block" "bookstore_bucket_public_access_block" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket

  block_public_acls       = false  # Allow public ACLs
  block_public_policy     = false  # Allow public policies (this is the key fix)
  ignore_public_acls      = false  # Do not ignore public ACLs
  restrict_public_buckets = false  # Allow public access to the bucket
}


# Define bucket policy for public read access
# Must depend on public access block to ensure it's configured first
resource "aws_s3_bucket_policy" "bookstore_bucket_policy" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "PublicReadGetObject"
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "arn:aws:s3:::${aws_s3_bucket.bookstore_bucket.bucket}/*"
      }
    ]
  })

  # Ensure public access block is configured before applying policy
  depends_on = [
    aws_s3_bucket_public_access_block.bookstore_bucket_public_access_block
  ]
}

# Upload files to the S3 bucket without using ACL

resource "aws_s3_object" "index_html" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "index.html"
  source = "../app/index.html"  # Local path to your index.html file
  content_type = "text/html"     # Set the correct MIME type
  etag   = filemd5("../app/index.html")  # Detect changes when file is updated
}

resource "aws_s3_object" "book_store_html" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "book_store.html"
  source = "../app/book_store.html"  # Local path to your book_store.html file
  content_type = "text/html"         # Set the correct MIME type
  etag   = filemd5("../app/book_store.html")  # Detect changes when file is updated
}

resource "aws_s3_object" "style_css" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "style.css"
  source = "../app/style.css"  # Local path to your style.css file
  content_type = "text/css"    # Set the correct MIME type
  etag   = filemd5("../app/style.css")  # Detect changes when file is updated
}

# Generate config.js from template with API URL
resource "aws_s3_object" "config_js" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "config.js"
  content = templatefile("${path.module}/../app/config.js.tpl", {
    api_url = local.api_url
  })
  content_type = "application/javascript"
  etag = md5(templatefile("${path.module}/../app/config.js.tpl", {
    api_url = local.api_url
  }))
  
  depends_on = [
    aws_api_gateway_deployment.bookstore_api_deployment
  ]
}

resource "aws_s3_object" "app_js" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "app.js"
  source = "../app/app.js"  # Local path to your app.js file
  content_type = "application/javascript"  # Set the correct MIME type
  etag   = filemd5("../app/app.js")  # Detect changes when file is updated
}

resource "aws_s3_object" "gabsy_image" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "images/gabsy.jpg"
  source = "../app/images/gabsy.jpg"  # Local path to your gabsy.jpg file
  content_type = "image/jpeg"  # Set the correct MIME type
}

resource "aws_s3_object" "ikigai_image" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "images/ikigai.jpg"
  source = "../app/images/ikigai.jpg"  # Local path to your ikigai.jpg file
  content_type = "image/jpeg"  # Set the correct MIME type
}

resource "aws_s3_object" "placeholder_image" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "images/placeholder.jpeg"
  source = "../app/images/placeholder.jpeg"  # Local path to your placeholder.jpeg file
  content_type = "image/jpeg"  # Set the correct MIME type
}

resource "aws_s3_object" "power_image" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "images/power.jpg"
  source = "../app/images/power.jpg"  # Local path to your power.jpg file
  content_type = "image/jpeg"  # Set the correct MIME type
}

resource "aws_s3_object" "user_image" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "images/user.svg"
  source = "../app/images/user.svg"  # Local path to your user.svg file
  content_type = "image/svg+xml"  # Set the correct MIME type
}

# Upload the Lambda function code (both Lambda functions in the same ZIP file)
resource "aws_s3_object" "lambda_functions_zip" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "lambda_functions.zip"  # The zip file for both Lambda functions
  source = "../lambda/lambda_functions.zip"  # The path to your local zip file
  etag   = filemd5("../lambda/lambda_functions.zip")  # Detect changes when zip file is updated
}