// const exchangeCodeForTokens = async () => {
//     try {
//       const urlParams = new URLSearchParams(window.location.search);
//       const authorizationCode = urlParams.get('code');
//       const cognitoTokenUrl = 'https://social-club.auth.us-east-1.amazoncognito.com/oauth2/token';
//       const clientId = '1gh15raf26sr6bfioam640c2rv';
//       const clientSecret = '1j04csarrjdk4poqna3effgooog4e31it7ngep3b51j88ib99hi0';
//       const redirectUri = 'https://social-bucket123.s3.amazonaws.com/book_store.html';
//       const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
  
//       const params = new URLSearchParams();
//       params.append('grant_type', 'authorization_code');
//       params.append('client_id', clientId);
//       params.append('code', authorizationCode);
//       params.append('redirect_uri', redirectUri);
  
//       const response = await axios.post(cognitoTokenUrl, params, {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': `Basic ${encodedCredentials}`
//         }
//       });
//       console.log(response.data)
//       return response.data;
//     } catch (error) {
//       throw new Error('Failed to exchange code for tokens: ' + error.message);
//     }
//   };
  
// exchangeCodeForTokens()
// .then(tokens => {
//     console.log('Received tokens:', tokens);
//     // Pass tokens to frontend for further usage
// })
// .catch(error => {
//     console.error('Error exchanging code for tokens:', error);
// });

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