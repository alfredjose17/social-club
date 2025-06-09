resource "aws_dynamodb_table" "books_table" {
  name         = "Books"
  billing_mode = "PAY_PER_REQUEST"  # This uses on-demand capacity (Free Tier eligible)

  # Define the primary key (partition key)
  attribute {
    name = "id"
    type = "S"  # id attribute will be a string
  }

  hash_key = "id"  # Set the primary key (partition key) to 'id'

  tags = {
    Name = "BooksTable"
  }
}
