import json
import boto3
import os

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DB_TABLE'])  # Table name is passed as an environment variable

# Lambda function handler for CRUD operations (GET, POST, PUT, DELETE)
def lambda_handler(event, context):
    http_method = event['httpMethod']
    
    if http_method == 'GET':
        return get_data(event)
    elif http_method == 'POST':
        return create_data(event)
    elif http_method == 'PUT':
        return update_data(event)
    elif http_method == 'DELETE':
        return delete_data(event)
    else:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid HTTP Method')
        }

# Get data from the database (retrieve record from the 'books' table)
def get_data(event):
    try:
        # Get the book ID from query parameters
        book_id = event['queryStringParameters']['id']
        
        # Fetch the book from DynamoDB
        response = table.get_item(Key={'id': book_id})
        
        if 'Item' in response:
            return {
                'statusCode': 200,
                'body': json.dumps(response['Item'])
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Book not found'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {str(e)}")
        }

# Create a new record in the 'books' table
def create_data(event):
    try:
        data = json.loads(event['body'])  # Parse incoming JSON body
        book_id = str(data['id'])  # Assuming the 'id' is passed as part of the request body
        book_title = data['title']
        book_author = data['author']
        book_publisher = data['publisher']
        book_year = data['year']
        book_cover = data['cover']

        # Add new item to DynamoDB table
        table.put_item(
            Item={
                'id': book_id,
                'title': book_title,
                'author': book_author,
                'publisher': book_publisher,
                'year': book_year,
                'cover': book_cover
            }
        )

        return {
            'statusCode': 201,
            'body': json.dumps('Book created successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {str(e)}")
        }

# Update an existing record in the 'books' table
def update_data(event):
    try:
        data = json.loads(event['body'])
        book_id = data['id']
        book_title = data['title']
        book_author = data['author']
        book_publisher = data['publisher']
        book_year = data['year']
        book_cover = data['cover']

        # Update item in DynamoDB
        table.update_item(
            Key={'id': book_id},
            UpdateExpression="set title = :t, author = :a, publisher = :p, year = :y, cover = :c",
            ExpressionAttributeValues={
                ':t': book_title,
                ':a': book_author,
                ':p': book_publisher,
                ':y': book_year,
                ':c': book_cover
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps('Book updated successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {str(e)}")
        }

# Delete an existing record from the 'books' table
def delete_data(event):
    try:
        data = json.loads(event['body'])
        book_id = data['id']

        # Delete item from DynamoDB
        table.delete_item(Key={'id': book_id})

        return {
            'statusCode': 200,
            'body': json.dumps('Book deleted successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error: {str(e)}")
        }
