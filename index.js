
class MusicPlatform {
  constructor() {
    this.searchForm = document.getElementById('searchForm');
    this.searchInput = document.getElementById('searchInput');
    this.resultsContainer = document.getElementById('resultsContainer');
    this.watchlistContainer = document.getElementById('watchlistContainer');

    this.searchForm.addEventListener('submit', this.handleSearch.bind(this));
    this.resultsContainer.addEventListener('click', this.handleAddToWatchlist.bind(this));
    this.watchlistContainer.addEventListener('click', this.handleRemoveFromWatchlist.bind(this));

    this.renderWatchlist();
  }

  handleSearch(event) {
    event.preventDefault();
    const searchQuery = this.searchInput.value.trim();
    this.searchTracks(searchQuery);
  }

  searchTracks(query) {
    fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'bb71f6d0a5msh8bea47b10b6fd85p1e95cbjsnac5a7c3dc7df',
        'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
      }
    })
      .then(response => response.json())
      .then(data => {
        this.displayResults(data.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  displayResults(tracks) {
    this.resultsContainer.innerHTML = '';
    const watchlist = this.getWatchlistData();

    tracks.forEach(track => {
      const card = document.createElement('div');
      card.classList.add('card');

      const image = document.createElement('img');
      image.src = track.album.cover_medium;
      card.appendChild(image);

      const title = document.createElement('p');
      title.textContent = track.title;
      card.appendChild(title);

      const artist = document.createElement('p');
      artist.textContent = track.artist.name;
      card.appendChild(artist);

      const addToWatchlistButton = document.createElement('button');
      const isAdded = watchlist.some(item => item.id === track.id);
      if (isAdded) {
        addToWatchlistButton.textContent = 'Added';
        card.classList.add('added');
      } else {
        addToWatchlistButton.textContent = 'Add to Watchlist';
      }
      addToWatchlistButton.setAttribute('data-track', JSON.stringify(track));
      card.appendChild(addToWatchlistButton);

      this.resultsContainer.appendChild(card);
    });
  }

  handleAddToWatchlist(event) {
    if (event.target.tagName === 'BUTTON') {
      const trackData = JSON.parse(event.target.getAttribute('data-track'));
      this.addWatchlistData(trackData);
    }
  }

  addWatchlistData(track) {
    let watchlist = this.getWatchlistData();
    watchlist.push(track);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    this.renderWatchlist();
    alert('Track added to watchlist!');
  }

  handleRemoveFromWatchlist(event) {
    if (event.target.tagName === 'BUTTON') {
      const trackId = event.target.getAttribute('data-track-id');
      this.removeWatchlistData(trackId);
    }
  }

  removeWatchlistData(trackId) {
    let watchlist = this.getWatchlistData();
    watchlist = watchlist.filter(track => track.id.toString() !== trackId.toString());
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    this.renderWatchlist();
    alert('Track removed from watchlist!');
  }

  getWatchlistData() {
    const watchlist = localStorage.getItem('watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
  }

  renderWatchlist() {
    const watchlist = this.getWatchlistData();
    this.watchlistContainer.innerHTML = '';
  
    watchlist.forEach(track => {
      const card = document.createElement('div');
      card.classList.add('card');
  
      card.innerHTML = `
        <img src="${track.album.cover_medium}">
        <p>${track.title}</p>
        <p>${track.artist.name}</p>
        <button class="removeFromWatchlistButton" data-track-id="${track.id}">Remove from Watchlist</button>
      `;
  
      this.watchlistContainer.appendChild(card);
    });
  }
  
}

const musicPlatform = new MusicPlatform();

  
  