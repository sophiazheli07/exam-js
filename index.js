
const API_KEY = "bb71f6d0a5msh8bea47b10b6fd85p1e95cbjsnac5a7c3dc7df";

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const favoritesContainer = document.getElementById('favorites-container');
const switchButton = document.getElementById('switchButton');
const currentSongContainer = document.getElementById('current-song-container');
const currentSongImage = document.getElementById('current-song-image');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');
const currentSongAudio = document.getElementById('current-song-audio');


let currentTrack = null;

searchButton.addEventListener('click', searchTracks);
favoritesContainer.addEventListener('click', removeFavorite);

switchButton.onclick = function() {
  if (resultsContainer.style.display !== 'none') {
    resultsContainer.style.display = 'none';
    favoritesContainer.style.display = 'flex';
  } else {
    resultsContainer.style.display = 'flex';
    favoritesContainer.style.display = 'none';
  }
}

function searchTracks() {
  const query = searchInput.value.trim();
  if (query === '') {
    return;
  }

  resultsContainer.innerHTML = '';

  fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
      'x-rapidapi-key': API_KEY
    }
  })
    .then(response => response.json())
    .then(data => {
      const tracks = data.data;
      if (tracks.length === 0) {
        resultsContainer.innerHTML = 'No results found.';
      } else {
        displayTracks(tracks);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultsContainer.innerHTML = 'An error occurred.';
    });
}

function displayTracks(tracks) {
  if (!tracks || tracks.length === 0) {
    resultsContainer.innerHTML = 'No results found.';
    return;
  }

  tracks.forEach(track => {
    const card = createCard(track);
    resultsContainer.appendChild(card);
  });
}

// Create card
function createCard(track) {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <img src="${track.album.cover_medium}" alt="${track.album.title}">
    <div class="content-wrapper">
      <h3>${track.title}</h3>
      <p>${track.artist.name}</p>
      <p>${track.album.title}</p>
    </div>
    <div class="audio-container">
      <audio src="${track.preview}" controls></audio>
    </div>
    <button>Add to Favorites</button>
  `;

  const addButton = card.querySelector('button');
  addButton.addEventListener('click', () => addToFavorites(addButton, track));

  const audioElement = card.querySelector('audio');
  audioElement.addEventListener('play', () => updateCurrentSong(track));
  audioElement.addEventListener('pause', () => clearCurrentSong());

  const favorites = getFavorites();
  if (favorites.some(favorite => favorite.id === track.id)) {
    card.classList.add('favorite');
    addButton.disabled = true;
  }

  return card;
}

function addToFavorites(button, track) {
  const favorites = getFavorites();
  favorites.push(track);
  saveFavorites(favorites);
  displayFavorites(favorites);

  button.disabled = true;
  button.textContent = 'Added to Favorites';
  button.classList.add('added-to-favorites');
}

function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function displayFavorites(favorites) {
  favoritesContainer.innerHTML = '';

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = 'No favorites added yet.';
  } else {
    favorites.forEach(track => {
      const card = createCard(track);
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove from Favorites';
      removeButton.addEventListener('click', () => removeFavorite(track));
      card.appendChild(removeButton);
      favoritesContainer.appendChild(card);
    });
  }
}

function removeFavorite(track) {
  const favorites = getFavorites();
  const index = favorites.findIndex(favorite => favorite.id === track.id);
  if (index > -1) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    displayFavorites(favorites);
  }
}

function updateCurrentSong(track) {
  currentSongContainer.style.display = 'block';
  currentTrack = track;
  currentSongImage.src = track.album.cover_medium;
  currentSongImage.alt = track.album.title;
  currentSongTitle.textContent = track.title;
  currentSongArtist.textContent = track.artist.name;
  currentSongAudio.src = track.preview;
}

function clearCurrentSong() {
  currentSongContainer.style.display = 'none';
  currentTrack = null;
  currentSongImage.src = '';
  currentSongImage.alt = '';
  currentSongTitle.textContent = '';
  currentSongArtist.textContent = '';
}

const initialFavorites = getFavorites();
displayFavorites(initialFavorites);
