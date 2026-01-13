import json
import boto3
import os

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['DB_TABLE'])  # Table name is passed as an environment variable

# Helper function to add CORS headers to responses
def add_cors_headers(response):
    """Add CORS headers to API Gateway response"""
    response['headers'] = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    }
    return response

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
        return add_cors_headers({
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid HTTP Method'})
        })

# Get data from the database (retrieve all records from the 'books' table)
def get_data(event):
    try:
        # Scan all items from DynamoDB table
        response = table.scan()
        
        books = response.get('Items', [])
        
        return add_cors_headers({
            'statusCode': 200,
            'body': json.dumps(books)
        })
    except Exception as e:
        return add_cors_headers({
            'statusCode': 500,
            'body': json.dumps({'error': f'Error fetching books: {str(e)}'})
        })

# Create a new record in the 'books' table
def create_data(event):
    try:
        # Check if body exists
        if not event.get('body'):
            return add_cors_headers({
                'statusCode': 400,
                'body': json.dumps({'error': 'Request body is required'})
            })
        
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

        return add_cors_headers({
            'statusCode': 201,
            'body': json.dumps({'message': 'Book created successfully'})
        })
    except KeyError as e:
        return add_cors_headers({
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required field: {str(e)}'})
        })
    except Exception as e:
        return add_cors_headers({
            'statusCode': 500,
            'body': json.dumps({'error': f'Error creating book: {str(e)}'})
        })

# Update an existing record in the 'books' table
def update_data(event):
    try:
        # Check if body exists
        if not event.get('body'):
            return add_cors_headers({
                'statusCode': 400,
                'body': json.dumps({'error': 'Request body is required'})
            })
        
        data = json.loads(event['body'])
        book_id = str(data['id'])  # Ensure ID is a string
        book_title = data['title']
        book_author = data['author']
        book_publisher = data['publisher']
        book_year = data['year']
        book_cover = data['cover']

        # Update item in DynamoDB (will create if doesn't exist)
        # Using ExpressionAttributeNames because 'year' is a reserved keyword in DynamoDB
        table.update_item(
            Key={'id': book_id},
            UpdateExpression="set title = :t, author = :a, publisher = :p, #yr = :y, cover = :c",
            ExpressionAttributeNames={
                '#yr': 'year'  # Alias for reserved keyword 'year'
            },
            ExpressionAttributeValues={
                ':t': book_title,
                ':a': book_author,
                ':p': book_publisher,
                ':y': book_year,
                ':c': book_cover
            },
            ReturnValues='UPDATED_NEW'  # Return updated attributes for debugging
        )

        return add_cors_headers({
            'statusCode': 200,
            'body': json.dumps({'message': 'Book updated successfully'})
        })
    except KeyError as e:
        return add_cors_headers({
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required field: {str(e)}'})
        })
    except Exception as e:
        # More detailed error logging
        error_message = str(e)
        error_type = type(e).__name__
        return add_cors_headers({
            'statusCode': 500,
            'body': json.dumps({
                'error': f'Error updating book: {error_message}',
                'error_type': error_type
            })
        })

# Delete an existing record from the 'books' table
def delete_data(event):
    try:
        # Check if body exists
        if not event.get('body'):
            return add_cors_headers({
                'statusCode': 400,
                'body': json.dumps({'error': 'Request body is required'})
            })
        
        data = json.loads(event['body'])
        book_id = data['id']

        # Delete item from DynamoDB
        table.delete_item(Key={'id': book_id})

        return add_cors_headers({
            'statusCode': 200,
            'body': json.dumps({'message': 'Book deleted successfully'})
        })
    except KeyError as e:
        return add_cors_headers({
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required field: {str(e)}'})
        })
    except Exception as e:
        return add_cors_headers({
            'statusCode': 500,
            'body': json.dumps({'error': f'Error deleting book: {str(e)}'})
        })
