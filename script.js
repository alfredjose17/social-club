const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const editButtons = document.querySelectorAll('.card_button');

btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});


iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});

let imgBx = document.querySelectorAll('.imgBx');
let contentBx = document.querySelectorAll('.contentBx');

for(var i = 0; i < imgBx.length; i++) {
    imgBx[i].addEventListener('mouseover', function(){
        for(var i = 0; i < contentBx.length; i++) {
            contentBx[i].className = 'contentBx';
        }
        document.getElementById(this.dataset.id).className = 'contentBx active';
        for(var i = 0; i < imgBx.length; i++) {
            imgBx[i].className = 'imgBx';
        }
        this.className = 'imgBx active';
    })
}

// Fetch book details from the server
fetch('/books')
    .then(response => response.json())
    .then(books => {
        // Update the card data with fetched book details
        books.forEach((book, index) => {
            const cardData = document.querySelectorAll('.card_data')[index];
            const titleElement = cardData.querySelector('.card_title');
            const descriptionElement = cardData.querySelector('.card_description');
            
            titleElement.innerText = book.title;
            descriptionElement.innerText = book.description;
        });
    })
    .catch(error => console.error('Error:', error));

// Event listener for editing card data
editButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior

        const cardData = this.parentNode;
        const titleElement = cardData.querySelector('.card_title');
        const descriptionElement = cardData.querySelector('.card_description');

        // Get the current text content of title and description
        let currentTitle = titleElement.innerText;
        let currentDescription = descriptionElement.innerText;

        // Prompt the user to edit the title and description
        let newTitle = prompt("Edit Title:", currentTitle);
        let newDescription = prompt("Edit Description:", currentDescription);

        // Update the title and description if the user entered something
        if (newTitle !== null && newDescription !== null) {
            titleElement.innerText = newTitle;
            descriptionElement.innerText = newDescription;
        }
    });
});