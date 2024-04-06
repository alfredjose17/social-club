const urlFragment = window.location.hash.substring(1);
const urlParams = new URLSearchParams(urlFragment);
const id_token = urlParams.get('id_token');
console.log(id_token)

const apiUrl = 'https://96s8ao9agj.execute-api.us-east-1.amazonaws.com/develop/books';

// Function to fetch books from the API
async function fetchBooks() {
    try {
        const response = await axios.get(apiUrl,
            {
                headers: {
                'Authorization': id_token
                }
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

fetchBooks();

// Function to add a new book via API
async function addBook(book) {
    try {
        const response = await axios.post(apiUrl, book,
            {
                headers: {
                'Authorization': id_token
                }
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
}

let book = {
    "body": {
      "Title": "Serverless Development on AWS",
      "Author": "Sheen Brisals and Luke Hedger",
      "Publisher": "O'Reilly Media",
      "Year": 2024
    }
  }

addBook(book)
fetchBooks();

// Function to update an existing book via API
async function updateBook(updatedBook) {
    try {
        const response = await axios.put(apiUrl, updatedBook,
            {
                headers: {
                'Authorization': id_token
                }
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
}

let updatedBook = {
    "body": {
      "Title": "Serverless Development on AWS",
      "Author": "Sheen Brisals and Luke Hedger",
      "Publisher": "O'Reilly Media",
      "Year": 2028
    }
  }

updateBook(updatedBook)
fetchBooks();

// Function to delete a book via API
async function deleteBook(title) {
    try {
        const response = await axios.delete(apiUrl,
            {
                headers: {
                'Authorization': id_token
                },
                data: title
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
}

let title = {
    "body": {
        "Title": "Serverless Development on AWS"
    }
}

deleteBook(title)
fetchBooks();