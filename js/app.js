const body = document.getElementsByTagName('body');
const gallery = document.getElementById('gallery');
const usersAPI = 'https://randomuser.me/api/?results=12';
const modalContainer = document.createElement('div');
const cards = document.getElementsByClassName('card');
const userData = fetchData(usersAPI);
let state = {
  response: undefined,
  selectedUser: undefined,
};

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
    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    <button type="button" id="modal-next" class="modal-next btn">Next</button>
  </div>
</div>
`;
body[0].appendChild(modalContainer);
modalContainer.style.display = 'none';
function closeModal() {
  modalContainer.style.display = 'none';
}

function fetchData(url) {
  return fetch(url)
      .then(checkStatus)
      .then(result => result.json())
      .catch(error => console.log('Looks like there was a problem', error));
}

async function getIndividual(data) {
  const userData = await fetchData(data);
  console.log(userData);
  const users = userData.results.map(async user => {
  });
}

function displayModal(username) {
    const userIndex = state.response.results.findIndex(user => user.login.username === username);
    const user = state.response.results[userIndex];
    console.log(user);
    console.log(userIndex);
    // const first = user.name.first;
    // const last = user.name.last;
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


function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function generateUsers() {
    const users = state.response.results.map(user => `
    <div class="card" onclick="displayModal('${user.login.username}')">
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
        console.log(response);
        state = {
          ...state,
          response,
        };
        console.log(state)
         generateUsers();
    });

  // userData
  //   .then(async user => {
  //     console.log(user);
  //   });

document.addEventListener('click', () => console.log());