# Provider Configuration
provider "aws" {
  region = "us-east-1"  # You can change this to your desired region
}

# Create an S3 bucket
resource "aws_s3_bucket" "bookstore_bucket" {
  bucket = "social-club-bookstore-bucket"

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
}

# Upload files to the S3 bucket without using ACL

resource "aws_s3_object" "index_html" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "index.html"
  source = "../app/index.html"  # Local path to your index.html file
  content_type = "text/html"     # Set the correct MIME type
}

resource "aws_s3_object" "book_store_html" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "book_store.html"
  source = "../app/book_store.html"  # Local path to your book_store.html file
  content_type = "text/html"         # Set the correct MIME type
}

resource "aws_s3_object" "style_css" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "style.css"
  source = "../app/style.css"  # Local path to your style.css file
  content_type = "text/css"    # Set the correct MIME type
}

resource "aws_s3_object" "app_js" {
  bucket = aws_s3_bucket.bookstore_bucket.bucket
  key    = "app.js"
  source = "../app/app.js"  # Local path to your app.js file
  content_type = "application/javascript"  # Set the correct MIME type
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

