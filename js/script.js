
//URL uses same seed and page number (1 based index) in order to get back the same results
let url = 'https://randomuser.me/api/?format=json&page=3&results=12&seed=abc&nat=us';
let users = [];
const gallery = document.getElementById('gallery');
const body = document.body;

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

function fetchData(url) {
    return fetch(url)
             .then(checkStatus)  
             .then(res => res.json())
             .catch(error => console.log('ATTENTION', error))
}

fetchData(url)
  .then(data => {
    users = data.results;
    generateUsers(users)
})

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

function generateUsers(data) {
    let usersHTML = "";

    data.forEach((user, idx) => {
        let largePic = user.picture.large;
        let firstName = user.name.first;
        let lastName = user.name.last;
        let email = user.email;
        let city = user.location.city;
        let state = user.location.state;

        usersHTML += `
            <div class="card" data-index="${idx}">
                <div class="card-img-container">
                    <img class="card-img" src=${largePic} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
                    <p class="card-text">${email}</p>
                    <p class="card-text cap">${city}, ${state}</p>
                </div>
            </div>
        `;
    });

    gallery.insertAdjacentHTML("beforeend", usersHTML);
}

function generateModal(idx) {
    let user = users[idx];
    let largePic = user.picture.large;
    let firstName = user.name.first;
    let lastName = user.name.last;
    let email = user.email;
    let location = user.location;
    let city = user.location.city;
    let state = user.location.state;
    let date = new Date(user.dob.date);
    let month = date.getMonth().toString().padStart(2, '0'); //appends leading 0 to bday month if only 1 digit
    let day = date.getDate().toString().padStart(2, '0'); 

    let modalHTML = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${largePic}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${user.cell}</p>
                <p class="modal-text">${location.street.number} ${location.street.name}, ${city}, ${state} ${location.postcode}</p>
                <p class="modal-text">Birthday: ${month}/${day}/${date.getFullYear()}</p>
            </div>
        </div>
    </div>
    `;  

    body.insertAdjacentHTML('beforeend', modalHTML);

    let closeBtn = document.getElementById('modal-close-btn');
    closeBtn.addEventListener('click', e => {
        document.querySelector('.modal-container').remove(); //close modal
    });
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
gallery.addEventListener('click', e => {
    let card = e.target.closest('.card');
    let idx = card.getAttribute('data-index');
    generateModal(idx);
});


