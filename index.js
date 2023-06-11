class MusicPlatform {
  constructor() {
    this.searchForm = document.getElementById("searchForm");
    this.searchInput = document.getElementById("searchInput");
    this.resultsContainer = document.getElementById("output");
    this.watchlistContainer = document.getElementById("watchlistContainer");
  
    this.searchForm.onsubmit = () => this.handleSearch(event);
    this.resultsContainer.onclick = (event) => this.handleAddToWatchlist(event);
    this.watchlistContainer.onclick = (event) => this.handleRemoveFromWatchlist(event);
  
    this.renderWatchlist();
  }
  

  handleSearch(event) {
    event.preventDefault();
    const searchQuery = this.searchInput.value.trim();
    this.searchTracks(searchQuery);
  }

  searchTracks(query) {
    fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${query}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "bb71f6d0a5msh8bea47b10b6fd85p1e95cbjsnac5a7c3dc7df",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.displayResults(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  displayResults(tracks) {
    this.resultsContainer.innerHTML = "";
    const watchlist = this.getWatchlistData();

    tracks.forEach((track) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${track.album.cover_medium}">
        <p>${track.title}</p>
        <p>${track.artist.name}</p>
        <button data-track="${JSON.stringify(track)}">${
        watchlist.some((item) => item.id === track.id)
          ? "Added"
          : "Add to Watchlist"
      }</button>
      `;

      if (watchlist.some((item) => item.id === track.id)) {
        card.classList.add("added");
      }

      this.resultsContainer.appendChild(card);
    });
  }

  handleAddToWatchlist(event) {
    if (event.target.tagName === "BUTTON") {
      const trackData = event.target.dataset.track;
      this.addWatchlistData(JSON.parse(trackData));
    }
  }

  addWatchlistData(track) {
    let watchlist = this.getWatchlistData();
    watchlist.push(track);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    this.renderWatchlist();
    alert("Track added to watchlist!");
  }

  handleRemoveFromWatchlist(event) {
    if (event.target.tagName === "BUTTON") {
      const trackId = event.target.getAttribute("data-track-id");
      this.removeWatchlistData(trackId);
    }
  }

  removeWatchlistData(trackId) {
    let watchlist = this.getWatchlistData();
    watchlist = watchlist.filter(
      (track) => track.id.toString() !== trackId.toString()
    );
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    this.renderWatchlist();
    alert("Track removed from watchlist!");
  }

  getWatchlistData() {
    const watchlist = localStorage.getItem("watchlist");
    return watchlist ? JSON.parse(watchlist) : [];
  }

  renderWatchlist() {
    const watchlist = this.getWatchlistData();
    this.watchlistContainer.innerHTML = "";

    watchlist.forEach((track) => {
      const card = document.createElement("div");
      card.classList.add("card");

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

document.addEventListener("DOMContentLoaded", () => {
  const musicPlatform = new MusicPlatform();
});
