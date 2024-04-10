var newBookAddBtn = document.querySelector('.addBookBtn');
var darkBg = document.querySelector('.dark_bg');
var popupForm = document.querySelector('.popup');
var crossBtn = document.querySelector('.closeBtn');
var submitBtn = document.querySelector('.submitBtn');
var modalTitle = document.querySelector('.modalTitle');
var popupFooter = document.querySelector('.popupFooter');
var imgInput = document.querySelector('.img');
var imgHolder = document.querySelector('.imgholder');
var form = document.querySelector('form');
var formInputFields = document.querySelectorAll('form input');
var uploadimg = document.querySelector("#uploadimg");
var title = document.getElementById("title");
var author = document.getElementById("author");
var publisher = document.getElementById("publisher");
var year = document.getElementById("year");
var entries = document.querySelector(".showEntries");
var tabSize = document.getElementById("table_size");
var bookInfo = document.querySelector(".bookInfo");
var table = document.querySelector("table");
var filterData = document.getElementById("search");

var originalData = localStorage.getItem('bookProfile') ? JSON.parse(localStorage.getItem('bookProfile')) : [];
var getData = [...originalData];

// Call fetchBooks on page load
window.addEventListener('load', () => {
    fetchBooks()
        .then(response => {
            // Parse the JSON response body
            let data = JSON.parse(response.body)

            const formattedData = data.map((book, index) => ({
                id: Date.now() + index,
                picture: book.Picture,
                title: book.Title,
                author: book.Author,
                publisher: book.Publisher,
                year: book.Year
            }));

            console.log(formattedData)

            // Store the fetched data in local storage
            localStorage.setItem('bookProfile', JSON.stringify(formattedData));

            showInfo();
            highlightIndexBtn();
            displayIndexBtn();
        })
        .catch(error => {
            console.error('Error fetching books on page load:', error);

            showInfo();
            highlightIndexBtn();
            displayIndexBtn();
        });
});


var isEdit = false;
var editId;

var arrayLength = 0;
var tableSize = 5;
var startIndex = 1;
var endIndex = 0;
var currentIndex = 1;
var maxIndex = 0;

// fetching ID token for API calls
const urlFragment = window.location.hash.substring(1);
const urlParams = new URLSearchParams(urlFragment);
const id_token = urlParams.get('id_token');
const apiUrl = 'https://96s8ao9agj.execute-api.us-east-1.amazonaws.com/develop/books';

showInfo();

newBookAddBtn.addEventListener('click', ()=> {
    isEdit = false;
    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";
    popupFooter.style.display = "block";
    imgInput.src = "images/placeholder.jpeg";
    darkBg.classList.add('active');
    popupForm.classList.add('active');
});

crossBtn.addEventListener('click', ()=>{
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();
});

uploadimg.onchange = function(){
    if(uploadimg.files[0].size < 1000000){   // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function(e){
            var imgUrl = e.target.result;
            imgInput.src = imgUrl;
        };

        fileReader.readAsDataURL(uploadimg.files[0]);
    } else {
        alert("This file is too large!");
    }
};

function preLoadCalculations(){
    array = getData;
    arrayLength = array.length;
    maxIndex = arrayLength / tableSize;

    if((arrayLength % tableSize) > 0){
        maxIndex++;
    }
}

function displayIndexBtn(){
    preLoadCalculations();

    const pagination = document.querySelector('.pagination');

    pagination.innerHTML = "";

    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>';

    for(let i=1; i<=maxIndex; i++){
        pagination.innerHTML += '<button onclick="paginationBtn('+i+')" index="'+i+'">'+i+'</button>';
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>';

    highlightIndexBtn();
}

function highlightIndexBtn(){
    startIndex = ((currentIndex - 1) * tableSize) + 1;
    endIndex = (startIndex + tableSize) - 1;

    if(endIndex > arrayLength){
        endIndex = arrayLength;
    }

    if(maxIndex >= 2){
        var nextBtn = document.querySelector(".next");
        nextBtn.classList.add("act");
    }

    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;

    var paginationBtns = document.querySelectorAll('.pagination button');
    paginationBtns.forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('index') === currentIndex.toString()){
            btn.classList.add('active');
        }
    });

    showInfo();
}


function showInfo(){
    document.querySelectorAll(".bookDetails").forEach(info => info.remove());

    var tab_start = startIndex - 1;
    var tab_end = endIndex;

    if(getData.length > 0){
        for(var i=tab_start; i<tab_end; i++){
            var book = getData[i];

            if(book){
                let createElement = `<tr class = "bookDetails">
                <td>${i+1}</td>
                <td><img src="${book.picture}" alt="" width="40" height="40"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publisher}</td>
                <td>${book.year}</td>
                <td>
                    <button onclick="readInfo('${book.picture}', '${book.title}', '${book.author}', '${book.publisher}', '${book.year}')"><i class="fa-regular fa-eye"></i></button>

                    <button onclick="editInfo('${i}', '${book.picture}', '${book.title}', '${book.author}', '${book.publisher}', '${book.year}')"><i class="fa-regular fa-pen-to-square"></i></button>

                    <button onclick="deleteInfo(${i})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`;

                bookInfo.innerHTML += createElement;
                table.style.minWidth = "1400px";
            }
        }
    } else {
        bookInfo.innerHTML = `<tr class="bookDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`;
        table.style.minWidth = "1400px";
    }
}

function readInfo(pic, Title, Author, Publisher, Year){
    imgInput.src = pic;
    title.value = Title;
    author.value = Author;
    publisher.value = Publisher;
    year.value = Year;

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "none";
    modalTitle.innerHTML = "Profile";
    formInputFields.forEach(input => {
        input.disabled = true;
    });

    imgHolder.style.pointerEvents = "none";
}

function editInfo(id, pic, Title, Author, Publisher, Year){
    isEdit = true;
    editId = id;

    const originalIndex = originalData.findIndex(item => item.id === id);

    originalData[originalIndex] = {
        id: id,
        picture: pic,
        title: Title,
        author: Author,
        publisher: Publisher,
        year: Year
    };

    imgInput.src = pic;
    title.value = Title;
    author.value = Author;
    publisher.value = Publisher;
    year.value = Year;

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    popupFooter.style.display = "block";
    modalTitle.innerHTML = "Update the Form";
    submitBtn.innerHTML = "Update";
    formInputFields.forEach(input => {
        input.disabled = false;
    });

    imgHolder.style.pointerEvents = "auto";
}

function deleteInfo(index){
    if(confirm("Are you sure you want to delete?")){
        const deletedItem = originalData.splice(index, 1);

        localStorage.setItem("bookProfile", JSON.stringify(originalData));
        
        getData = [...originalData];

        preLoadCalculations();

        if(getData.length === 0){
            currentIndex = 1;
            startIndex = 1;
            endIndex = 0;
        } else if(currentIndex > maxIndex){
            currentIndex = maxIndex;
        }

        showInfo();
        highlightIndexBtn();
        displayIndexBtn();

        var nextBtn = document.querySelector('.next');
        var prevBtn = document.querySelector('.prev');

        if(Math.floor(maxIndex) > currentIndex){
            nextBtn.classList.add("act");
        } else {
            nextBtn.classList.remove("act");
        }

        if(currentIndex > 1){
            prevBtn.classList.add('act');
        }

        // API call
        const title = {
            "body": {
                "Title": deletedItem[0].title
            }
        }
        deleteBook(title)
    }
}

function getFormData() {
    const formData = {
        picture: imgInput.src,
        title: title.value,
        author: author.value,
        publisher: publisher.value,
        year: year.value
    };
    return formData;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        id: Date.now(),
        picture: imgInput.src,
        title: title.value,
        author: author.value,
        publisher: publisher.value,
        year: year.value
    };

    if (!isEdit) {
        originalData.unshift(information);

        // API call
        const book = {
            "body": {
            "Title": information.title,
            "Author": information.author,
            "Publisher": information.publisher,
            "Year": information.year,
            "Picture": information.picture
            }
        }
        addBook(book)

    } else {
        originalData[editId] = information;

        // API call
        const updatedBook = {
            "body": {
            "Title": information.title,
            "Author": information.author,
            "Publisher": information.publisher,
            "Year": information.year,
            "Picture": information.picture
            }
        }
        updateBook(updatedBook)
    }
    getData = [...originalData];
    localStorage.setItem('bookProfile', JSON.stringify(originalData));

    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";

    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    showInfo();
    form.reset();

    highlightIndexBtn();
    displayIndexBtn();

    var nextBtn = document.querySelector(".next");
    var prevBtn = document.querySelector(".prev");
    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act");
    } else {
        nextBtn.classList.remove("act");
    }

    if (currentIndex > 1) {
        prevBtn.classList.add("act");
    }
});


function next(){
    var prevBtn = document.querySelector('.prev');
    var nextBtn = document.querySelector('.next');

    if(currentIndex <= maxIndex - 1){
        currentIndex++;
        prevBtn.classList.add("act");

        highlightIndexBtn();
    }

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove("act");
    }
}

function prev(){
    var prevBtn = document.querySelector('.prev');

    if(currentIndex > 1){
        currentIndex--;
        prevBtn.classList.add("act");
        highlightIndexBtn();
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act");
    }
}

function paginationBtn(i){
    currentIndex = i;

    var prevBtn = document.querySelector('.prev');
    var nextBtn = document.querySelector('.next');

    highlightIndexBtn();

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove('act');
    } else {
        nextBtn.classList.add("act");
    }

    if(currentIndex > 1){
        prevBtn.classList.add("act");
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act");
    }
}

tabSize.addEventListener('change', ()=>{
    var selectedValue = parseInt(tabSize.value);
    tableSize = selectedValue;
    currentIndex = 1;
    startIndex = 1;
    displayIndexBtn();
});

filterData.addEventListener("input", ()=> {
    const searchTerm = filterData.value.toLowerCase().trim();

    if(searchTerm !== ""){

        const filteredData = originalData.filter((item) => {
            const title = item.title.toLowerCase();
            const author = item.author.toLowerCase();
            const publisher = item.publisher.toLowerCase();
            const year = item.year.toLowerCase();

            return(
                title.includes(searchTerm) ||
                author.includes(searchTerm) ||
                publisher.includes(searchTerm) ||
                year.includes(searchTerm)
            );
        });

        getData = filteredData;
    } else {
        getData = JSON.parse(localStorage.getItem('bookProfile')) || [];
    }

    currentIndex = 1;
    startIndex = 1;
    displayIndexBtn();
});

displayIndexBtn();

// Function to fetch books from the API
async function fetchBooks() {
    try {
        const response = await axios.get(apiUrl,
            {
                // headers: {
                // 'Authorization': id_token
                // }
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

// Function to add a new book via API
async function addBook(book) {
    try {
        const response = await axios.post(apiUrl, book,
            {
                // headers: {
                // 'Authorization': id_token
                // }
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error);
        throw error;
    }
}

// Function to update an existing book via API
async function updateBook(updatedBook) {
    try {
        const response = await axios.put(apiUrl, updatedBook,
            {
                // headers: {
                // 'Authorization': id_token
                // }
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
}

// Function to delete a book via API
async function deleteBook(title) {
    try {
        const response = await axios.delete(apiUrl,
            {
                // headers: {
                // 'Authorization': id_token
                // },
                data: title
            });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
}
