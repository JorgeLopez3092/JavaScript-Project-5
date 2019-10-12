const body = document.getElementsByTagName('body');
const gallery = document.getElementById('gallery');
const usersAPI = 'https://randomuser.me/api/?results=12';
const modalContainer = document.createElement('div');
const cards = document.getElementsByClassName('card');

modalContainer.classList.add('modal-container');
modalContainer.innerHTML = `
<div class="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
        <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
        <h3 id="name" class="modal-name cap">name</h3>
        <p class="modal-text">email</p>
        <p class="modal-text cap">city</p>
        <hr>
        <p class="modal-text">(555) 555-5555</p>
        <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
        <p class="modal-text">Birthday: 10/21/2015</p>
    </div>
`;
// modalContainer.style.display = 'none';

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

function displayModal(data) {
    for (let i = 0; i < data.results.length; i++) {
      const name = `${data.results[i].name.first} ${data.results[i].name.last}`
      console.log(name)
    }
  }
  

function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function generateUsers(data) {
    const users = data.results.map(user => `
    <div class="card">
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

  fetchData(usersAPI)
    .then(async data => {
        console.log(data);
        await generateUsers(data);
    });



