# Define the API Gateway
resource "aws_api_gateway_rest_api" "bookstore_api" {
  name        = "bookstore-api"
  description = "API for CRUD operations on books"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "books" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  parent_id   = aws_api_gateway_rest_api.bookstore_api.root_resource_id
  path_part   = "books"
}

# GET Method - Retrieve books
resource "aws_api_gateway_method" "get_books" {
  rest_api_id   = aws_api_gateway_rest_api.bookstore_api.id
  resource_id   = aws_api_gateway_resource.books.id
  http_method   = "GET"
  authorization = "NONE"
}

# POST Method - Create a new book
resource "aws_api_gateway_method" "create_book" {
  rest_api_id   = aws_api_gateway_rest_api.bookstore_api.id
  resource_id   = aws_api_gateway_resource.books.id
  http_method   = "POST"
  authorization = "NONE"
}

# PUT Method - Update an existing book
resource "aws_api_gateway_method" "update_book" {
  rest_api_id   = aws_api_gateway_rest_api.bookstore_api.id
  resource_id   = aws_api_gateway_resource.books.id
  http_method   = "PUT"
  authorization = "NONE"
}

# DELETE Method - Delete a book
resource "aws_api_gateway_method" "delete_book" {
  rest_api_id   = aws_api_gateway_rest_api.bookstore_api.id
  resource_id   = aws_api_gateway_resource.books.id
  http_method   = "DELETE"
  authorization = "NONE"
}

data "aws_region" "current" {}

# GET Integration (Lambda Proxy integration)
resource "aws_api_gateway_integration" "get_books_integration" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.get_books.http_method

  integration_http_method = "POST"  # Use GET for GET method
  type                    = "AWS_PROXY"  # AWS Proxy integration
  uri                     = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.api_lambda_function.arn}/invocations"
}

# POST Integration (Lambda Proxy integration)
resource "aws_api_gateway_integration" "create_book_integration" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.create_book.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.api_lambda_function.arn}/invocations"
}

# PUT Integration (Lambda Proxy integration)
resource "aws_api_gateway_integration" "update_book_integration" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.update_book.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.api_lambda_function.arn}/invocations"
}

# DELETE Integration (Lambda Proxy integration)
resource "aws_api_gateway_integration" "delete_book_integration" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.delete_book.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.api_lambda_function.arn}/invocations"
}

# Method Response - GET
resource "aws_api_gateway_method_response" "get_books_method_response" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.get_books.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }
}

# Method Response - POST (Created)
resource "aws_api_gateway_method_response" "create_book_method_response" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.create_book.http_method
  status_code = "201"  # Created

  response_models = {
    "application/json" = "Empty"
  }
}

# Method Response - PUT (Updated)
resource "aws_api_gateway_method_response" "update_book_method_response" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.update_book.http_method
  status_code = "200"  # OK

  response_models = {
    "application/json" = "Empty"
  }
}

# Method Response - DELETE (No Content)
resource "aws_api_gateway_method_response" "delete_book_method_response" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  resource_id = aws_api_gateway_resource.books.id
  http_method = aws_api_gateway_method.delete_book.http_method
  status_code = "204"  # No Content

  response_models = {
    "application/json" = "Empty"
  }
}

# Lambda Permissions
resource "aws_lambda_permission" "allow_apigateway" {
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.api_lambda_function.function_name
  statement_id  = "AllowAPIGatewayInvoke"
}

# Deployment
resource "aws_api_gateway_deployment" "bookstore_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.bookstore_api.id
  stage_name  = "dev"

  depends_on = [
    aws_api_gateway_integration.get_books_integration,
    aws_api_gateway_integration.create_book_integration,
    aws_api_gateway_integration.update_book_integration,
    aws_api_gateway_integration.delete_book_integration,
  ]
}
