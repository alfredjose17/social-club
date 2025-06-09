# IAM role for Lambda to interact with RDS
resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "api_lambda_function" {
  function_name = "api_lambda_function"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "lambda_functions.lambda_handler"  # Lambda function handler
  runtime       = "python3.8"  # Use the runtime you are using
  s3_bucket     = aws_s3_bucket.bookstore_bucket.bucket
  s3_key        = "lambda_functions.zip"  # Reference to the S3 location of your Lambda code

  environment {
    variables = {
      DB_TABLE = "Books"  # Use your table name
    }
  }

  depends_on = [aws_iam_role.lambda_execution_role]  # Ensure IAM role is created before Lambda
}

# IAM Policy for Lambda to interact with DynamoDB
resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "lambda-dynamodb-policy"
  description = "IAM policy for Lambda to interact with DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.books_table.arn  # Resource for the Books table
      }
    ]
  })
}

# Attach DynamoDB policy to Lambda execution role
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
  role       = aws_iam_role.lambda_execution_role.name
}
