const body = document.getElementsByTagName('body')[0];
const gallery = document.getElementById('gallery');
const usersAPI = 'https://randomuser.me/api/?results=12';
const modalContainer = document.createElement('div');
const searchContainer = document.getElementsByClassName('search-container')[0];
const cards = document.getElementsByClassName('card');
const userData = fetchData(usersAPI);
//object to store info from JSON response object for reuseability
let state = {
  response: undefined,
  selectedUser: undefined,
};

searchContainer.innerHTML = `
  <form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit" onclick="searchActivate()">
  </form>
`;

modalContainer.classList.add('modal-container');
modalContainer.innerHTML = `
<div class="modal">
    <button type="button" id="modal-close-btn" onclick="closeModal()" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
        <img class="modal-img" id="modal-picture" src="https://placehold.it/125x125" alt="profile picture">
        <h3 id="modal-name" class="modal-name cap">name</h3>
        <p class="modal-text" id="modal-email">email</p>
        <p class="modal-text cap" id="modal-city">city</p>
        <hr>
        <p class="modal-text" id="modal-phone-number">(555) 555-5555</p>
        <p class="modal-text" id="modal-street-address">123 Portland Ave., Portland, OR 97204</p>
        <p class="modal-text" id="modal-birthday">Birthday: 10/21/2015</p>
    </div>
  </div>
  <div class="modal-btn-container">
    <button type="button" id="modal-prev" class="modal-prev btn" onClick="displayPrev()">Prev</button>
    <button type="button" id="modal-next" class="modal-next btn" onClick="displayNext()">Next</button>
  </div>
</div>
`;
body.appendChild(modalContainer);
modalContainer.style.display = 'none';

function fetchData(url) {
  return fetch(url)
      .then(checkStatus)
      .then(result => result.json())
      .catch(error => console.log('Looks like there was a problem', error));
}

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function closeModal() {
  modalContainer.style.display = 'none';
}

function displayModal(userEmail) {
    const userIndex = state.response.results.findIndex(user => user.email === userEmail);
    const user = state.response.results[userIndex];
    const stateAbbrev = user.location.state.toUpperCase().slice(0, 2);
    const { name, email, location, phone, dob, picture } = user;
    const { large } = picture;
    const { first, last } = name;
    const { city, postcode, } = location;
    const { date } = dob;
    const _date = new Date(date);
    const month = _date.getUTCMonth()+1;
    const day = _date.getUTCDate();
    const year = _date.getUTCFullYear();
    document.getElementById('modal-picture').setAttribute('src', large);
    document.getElementById('modal-name').innerText = `${first} ${last}`;
    document.getElementById('modal-email').innerText = email;
    document.getElementById('modal-city').innerText = city;
    document.getElementById('modal-phone-number').innerText = phone;
    document.getElementById('modal-street-address').innerText = `${user.location.street.number} ${user.location.street.name}, ${city}, ${stateAbbrev} ${postcode}`;
    document.getElementById('modal-birthday').innerText = `Birthday: ${month}-${day}-${year}`;
    modalContainer.style.display = '';
  }

  function displayNext() {
    const modalEmail = document.getElementById('modal-email').innerText;
    const userIndex = state.response.results.findIndex(user => user.email === modalEmail);
    let nextIndex;
    //check to see if the index is already at the highest possible and set it back down to 0 if it is
    if(userIndex < state.response.results.length - 1) {
      nextIndex = userIndex + 1;
    } else  {
      nextIndex = 0;
    }
    const nextEmail = state.response.results[nextIndex].email;
    displayModal(nextEmail);    
  }

  function displayPrev() {
    const modalEmail = document.getElementById('modal-email').innerText;
    const userIndex = state.response.results.findIndex(user => user.email === modalEmail);
    let prevIndex;
    //carousel check to see if the index is already at 0 and and set it back down to the lowest item on the list if it is
    if(userIndex > 0) {
      prevIndex = userIndex - 1;
    } else  {
      prevIndex = state.response.results.length - 1;
    }
    const prevEmail = state.response.results[prevIndex].email;
    displayModal(prevEmail); 
  }
  
  function searchActivate() {
    const searchBar = document.getElementById('search-input');
    let filter = searchBar.value.toUpperCase();
    const users = document.getElementsByClassName('card-name');
    const userCards = document.getElementsByClassName('card');
    for (let i = 0; i < users.length; i++) {
       const userNames = users[i].innerText.toUpperCase();
       if (userNames.indexOf(filter) === -1) {
        userCards[i].style.display = 'none';
       } else {
        userCards[i].style.display = "";
       }
    }
 }

//creates a new card for every result. carddiv on click ties a displayModal to every card with that cards email passed as an argument
  function generateUsers() {
    const users = state.response.results.map(user => `
    <div class="card" onclick="displayModal('${user.email}')">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>
    `).join('');
    gallery.innerHTML = users;
  }

  userData
    .then(response => {
        state = {
          ...state,
          response,
        };
         generateUsers();
    });
