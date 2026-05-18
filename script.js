const homeView = document.getElementById("homeView");
const playerView = document.getElementById("playerView");
const navHomeBtn = document.getElementById("navHomeBtn");
const navPlayerBtn = document.getElementById("navPlayerBtn");

function switchToView(viewName) {
  if(viewName === 'home') {
    homeView.classList.add("active");
    playerView.classList.remove("active");
    navHomeBtn.style.color = "#c1121f";
    navPlayerBtn.style.color = "inherit";
  } else {
    homeView.classList.remove("active");
    playerView.classList.add("active");
    navPlayerBtn.style.color = "#c1121f";
    navHomeBtn.style.color = "inherit";
  }
}

navHomeBtn.addEventListener("click", () => switchToView('home'));
navPlayerBtn.addEventListener("click", () => switchToView('player'));

const fileInput = document.getElementById("fileInput");
const addSongBtn = document.getElementById("addSongBtn");
const albumArt = document.getElementById("albumArt");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const toggleModeCheckbox = document.getElementById("checkbox");

const shuffleBtn = document.getElementById("shuffleBtn");
const volumeSlider = document.getElementById("volumeSlider");
const volIconSvg = document.getElementById("volIconSvg");

const playlistsContainer = document.getElementById("playlistsContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const playerHeartBtn = document.getElementById("playerHeartBtn");
const createPlaylistBtn = document.getElementById("createPlaylistBtn");

const toggleLeftBtn = document.getElementById("toggleLeftBtn");
const sidebarLeftPanel = document.getElementById("sidebarLeftPanel");
const toggleRightBtn = document.getElementById("toggleRightBtn");
const sidebarRightPanel = document.getElementById("sidebarRightPanel");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

const lyricsToggleBtn = document.getElementById("lyricsToggleBtn");
const lyricsContainer = document.getElementById("lyricsContainer");
const lyricsContent = document.getElementById("lyricsContent");
const editLyricsBtn = document.getElementById("editLyricsBtn");
const lyricsScrollArea = document.getElementById("lyricsScrollArea");

const sortTitleBtn = document.getElementById("sortTitleBtn");
const sortArtistBtn = document.getElementById("sortArtistBtn");
const sortGenreBtn = document.getElementById("sortGenreBtn");

let audio = new Audio();
let songs = [];
let currentIndex = 0;
let isPlaying = false;
let lyricsModeActive = false;
let isEditingLyrics = false;
let isShuffleActive = false;
let currentSortCriteria = 'title';

let customLyricsDatabase = JSON.parse(localStorage.getItem("customLyricsDatabase")) || {};
let recent = JSON.parse(localStorage.getItem("recent")) || [];

let playlists = { "My Playlist": [] }; 
let favorites = [];
let collapsedStates = { "My Playlist": false };

const fallbackCover = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%23444'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H11V10h2v6zm0-8H11V6h2v2z'/></svg>";

function showToast(text) {
  toastText.textContent = text;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

document.addEventListener("click", () => {
  document.querySelectorAll(".playlist-dropdown-menu").forEach(el => el.classList.remove("show"));
});

volumeSlider.addEventListener("input", (e) => {
  const val = e.target.value;
  audio.volume = val;
  if (val == 0) {
    volIconSvg.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
  } else if (val < 0.5) {
    volIconSvg.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
  } else {
    volIconSvg.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
  }
});

toggleLeftBtn.addEventListener("click", () => {
  sidebarLeftPanel.classList.toggle("hidden");
  toggleLeftBtn.textContent = sidebarLeftPanel.classList.contains("hidden") ? "▶" : "◀";
});

toggleRightBtn.addEventListener("click", () => {
  sidebarRightPanel.classList.toggle("hidden");
  toggleRightBtn.textContent = sidebarRightPanel.classList.contains("hidden") ? "◀" : "▶";
});

toggleModeCheckbox.addEventListener("change", (e) => {
  if(e.target.checked) {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
});

addSongBtn.addEventListener("click", () => {
  fileInput.click();
});

shuffleBtn.addEventListener("click", () => {
  isShuffleActive = !isShuffleActive;
  if(isShuffleActive) {
    shuffleBtn.classList.add("active");
  } else {
    shuffleBtn.classList.remove("active");
  }
});

lyricsToggleBtn.addEventListener("click", () => {
  lyricsModeActive = !lyricsModeActive;
  
  if (lyricsModeActive) {
    sidebarLeftPanel.classList.add("hidden");
    sidebarRightPanel.classList.add("hidden");
    toggleLeftBtn.textContent = "▶";
    toggleRightBtn.textContent = "◀";
    lyricsContainer.classList.add("show");
    lyricsToggleBtn.style.background = "#5c000b";
  } else {
    sidebarLeftPanel.classList.remove("hidden");
    sidebarRightPanel.classList.remove("hidden");
    toggleLeftBtn.textContent = "◀";
    toggleRightBtn.textContent = "▶";
    if (isEditingLyrics) toggleLyricsEditState();
    lyricsContainer.classList.remove("show");
    lyricsToggleBtn.style.background = "linear-gradient(135deg, #800020, #4a0012)";
  }
});

editLyricsBtn.addEventListener("click", () => {
  if (songs.length === 0) return;
  toggleLyricsEditState();
});

function toggleLyricsEditState() {
  const currentSong = songs[currentIndex];
  const songStorageKey = `${currentSong.name} - ${currentSong.artist}`;

  if (!isEditingLyrics) {
    isEditingLyrics = true;
    editLyricsBtn.textContent = "💾 Save";
    editLyricsBtn.style.background = "#006400";

    const textarea = document.createElement("textarea");
    textarea.className = "lyrics-editor";
    textarea.id = "lyricsTextArea";
    textarea.value = (lyricsContent.textContent === "No lyrics available for this track.") ? "" : lyricsContent.textContent;
    
    lyricsScrollArea.innerHTML = "";
    lyricsScrollArea.appendChild(textarea);
  } else {
    isEditingLyrics = false;
    editLyricsBtn.textContent = "✏️ Edit";
    editLyricsBtn.style.background = "linear-gradient(135deg, #800020, #4a0012)";

    const textarea = document.getElementById("lyricsTextArea");
    const updatedText = textarea.value.trim();

    const finalizedLyrics = updatedText || "No lyrics available for this track.";
    currentSong.lyrics = finalizedLyrics;
    customLyricsDatabase[songStorageKey] = finalizedLyrics;
    localStorage.setItem("customLyricsDatabase", JSON.stringify(customLyricsDatabase));

    lyricsScrollArea.innerHTML = "";
    const div = document.createElement("div");
    div.className = "lyrics-content";
    div.id = "lyricsContent";
    div.textContent = finalizedLyrics;
    lyricsScrollArea.appendChild(div);
    
    showToast("Lyrics Saved Locally");
  }
}

fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  let filesProcessed = 0;

  if (files.length === 0) return;

  Array.from(files).forEach(file => {
    if (file.type.startsWith("audio")) {
      const baseName = file.name.split(".")[0];
      
      let trackObject = {
        name: baseName,
        artist: "Unknown Artist",
        genre: "Unknown Genre",
        cover: fallbackCover,
        lyrics: "No lyrics available for this track.",
        url: URL.createObjectURL(file)
      };

      window.jsmediatags.read(file, {
        onSuccess: function(tag) {
          const tags = tag.tags;
          
          if (tags.title) trackObject.name = tags.title;
          if (tags.artist) trackObject.artist = tags.artist;
          if (tags.genre) trackObject.genre = tags.genre;
          
          const songStorageKey = `${trackObject.name} - ${trackObject.artist}`;
          if (customLyricsDatabase[songStorageKey]) {
            trackObject.lyrics = customLyricsDatabase[songStorageKey];
          } else {
            if (tags.lyrics && tags.lyrics.lyrics) {
              trackObject.lyrics = tags.lyrics.lyrics;
            } else if (tags.USLT && tags.USLT.lyrics) {
              trackObject.lyrics = tags.USLT.lyrics;
            }
          }

          if (tags.picture) {
            const image = tags.picture;
            let base64String = "";
            for (let i = 0; i < image.data.length; i++) {
              base64String += String.fromCharCode(image.data[i]);
            }
            const base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
            trackObject.cover = base64;
          }

          finalizeTrackLoading();
        },
        onError: function(error) {
          console.log("No ID3 metadata tags found:", error);
          const songStorageKey = `${trackObject.name} - ${trackObject.artist}`;
          if (customLyricsDatabase[songStorageKey]) {
            trackObject.lyrics = customLyricsDatabase[songStorageKey];
          }
          finalizeTrackLoading();
        }
      });

      function finalizeTrackLoading() {
        songs.push(trackObject);
        filesProcessed++;
        
        if (filesProcessed === files.length) {
          if (songs.length > 0) {
            sortMasterSongsList(currentSortCriteria);
            switchToView('home');
          }
        }
      }

    } else {
      filesProcessed++;
    }
  });
});

function sortMasterSongsList(criteria) {
  currentSortCriteria = criteria;
  let activeTrack = songs[currentIndex];

  if (criteria === 'title') {
    songs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (criteria === 'artist') {
    songs.sort((a, b) => a.artist.localeCompare(b.artist));
  } else if (criteria === 'genre') {
    songs.sort((a, b) => a.genre.localeCompare(b.genre));
  }

  if (activeTrack) {
    currentIndex = songs.findIndex(s => s.name === activeTrack.name && s.artist === activeTrack.artist);
  }

  renderDashboardGrids();
  updatePlaylist();
  updateSortPillStyles();
}

function updateSortPillStyles() {
  sortTitleBtn.classList.toggle("active", currentSortCriteria === 'title');
  sortArtistBtn.classList.toggle("active", currentSortCriteria === 'artist');
  sortGenreBtn.classList.toggle("active", currentSortCriteria === 'genre');
}

sortTitleBtn.addEventListener("click", () => sortMasterSongsList('title'));
sortArtistBtn.addEventListener("click", () => sortMasterSongsList('artist'));
sortGenreBtn.addEventListener("click", () => sortMasterSongsList('genre'));

function renderDashboardGrids() {
  renderPlaylistsDashboardGrid();
  renderRecentDashboardGrid();
}

function renderPlaylistsDashboardGrid() {
  const dashPlaylistsGrid = document.getElementById("dashPlaylistsGrid");
  dashPlaylistsGrid.innerHTML = "";
  
  const playlistKeys = Object.keys(playlists);
  
  if (playlistKeys.length === 0) {
    dashPlaylistsGrid.innerHTML = `
      <div class="empty-state-banner">
        <h3>No Playlists Created</h3>
        <p>Go to the Now Playing view to create and build custom music lists.</p>
      </div>`;
    return;
  }

  playlistKeys.forEach((folderName) => {
    const playlistTracks = playlists[folderName];
    const trackCount = playlistTracks.length;
    
    const coverArtSrc = (trackCount > 0) ? playlistTracks[0].cover : fallbackCover;

    const card = document.createElement("div");
    card.className = "music-card";
    card.innerHTML = `
      <img src="${coverArtSrc}" alt="Playlist Cover art">
      <h4>${folderName}</h4>
      <p>${trackCount} ${trackCount === 1 ? 'Track' : 'Tracks'}</p>
      <div class="card-play-overlay">
        <div style="width:0; height:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:8px solid #fff; margin-left:2px;"></div>
      </div>
    `;

    card.addEventListener("click", () => {
      if (trackCount === 0) {
        alert(`The playlist '${folderName}' is currently empty. Add tracks from the Now Playing list!`);
        return;
      }
      
      const masterIdx = songs.findIndex(s => s.name === playlistTracks[0].name && s.artist === playlistTracks[0].artist);
      if (masterIdx !== -1) {
        loadSong(masterIdx);
        switchToView('player');
        isPlaying = false;
        togglePlay();
      }
    });
    dashPlaylistsGrid.appendChild(card);
  });
}

function renderRecentDashboardGrid() {
  const dashRecentGrid = document.getElementById("dashRecentGrid");
  dashRecentGrid.innerHTML = "";
  
  if (recent.length === 0) {
    dashRecentGrid.innerHTML = "<p style='color:#666; font-size:14px; margin-left:5px;'>Your recently played tracks will show up here.</p>";
    return;
  }

  const limitedRecent = recent.slice(0, 6);

  limitedRecent.forEach((recentSong) => {
    const masterIdx = songs.findIndex(s => s.name === recentSong.name && s.artist === recentSong.artist);
    if (masterIdx !== -1) {
      const card = document.createElement("div");
      card.className = "music-card";
      card.innerHTML = `
        <img src="${recentSong.cover}" alt="Cover art">
        <h4>${recentSong.name}</h4>
        <p>${recentSong.artist}</p>
        <div class="card-play-overlay">
          <div style="width:0; height:0; border-top:5px solid transparent; border-bottom:5px solid transparent; border-left:8px solid #fff; margin-left:2px;"></div>
        </div>
      `;
      card.addEventListener("click", () => {
        loadSong(masterIdx);
        switchToView('player');
        isPlaying = false;
        togglePlay();
      });
      dashRecentGrid.appendChild(card);
    }
  });
}

function loadSong(index) {
  currentIndex = index;
  const song = songs[index];
  audio.src = song.url;
  songTitle.textContent = song.name;
  artistName.textContent = song.artist;
  albumArt.src = song.cover;
  
  if (isEditingLyrics) {
    isEditingLyrics = false;
    editLyricsBtn.textContent = "✏️ Edit";
    editLyricsBtn.style.background = "linear-gradient(135deg, #800020, #4a0012)";
  }

  lyricsScrollArea.innerHTML = "";
  const div = document.createElement("div");
  div.className = "lyrics-content";
  div.id = "lyricsContent";
  div.textContent = song.lyrics;
  lyricsScrollArea.appendChild(div);

  progress.style.width = "0%";
  updateHeartButtonState();
  addRecent(song);
}

function togglePlay() {
  if (!audio.src) return;
  if (isPlaying) {
    audio.pause();
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  } else {
    audio.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "flex";
  }
  isPlaying = !isPlaying;
}

playBtn.addEventListener("click", togglePlay);

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = (clickX / width) * duration;
  }
});

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

audio.addEventListener("ended", () => {
  handleNextTrack();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  handleNextTrack();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (songs.length === 0) return;
  if (isShuffleActive && songs.length > 1) {
    let nextRoll;
    do {
      nextRoll = Math.floor(Math.random() * songs.length);
    } while (nextRoll === currentIndex);
    currentIndex = nextRoll;
  } else {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  }
  loadSong(currentIndex);
  if (isPlaying) audio.play();
});

function handleNextTrack() {
  if (songs.length === 0) return;
  if (isShuffleActive && songs.length > 1) {
    let nextRoll;
    do {
      nextRoll = Math.floor(Math.random() * songs.length);
    } while (nextRoll === currentIndex);
    currentIndex = nextRoll;
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
  if (isPlaying) audio.play();
}

playerHeartBtn.addEventListener("click", () => {
  if (songs.length === 0 || currentIndex >= songs.length) return;
  const currentSong = songs[currentIndex];
  
  const index = favorites.findIndex(fav => fav.name === currentSong.name);
  if (index === -1) {
    favorites.push(currentSong);
    showToast("Added to Favorites");
  } else {
    favorites.splice(index, 1);
    showToast("Removed from Favorites");
  }
  renderFavoritesList();
  updateHeartButtonState();
});

function updateHeartButtonState() {
  if (songs.length === 0 || currentIndex >= songs.length) {
    playerHeartBtn.classList.add("empty");
    return;
  }
  const currentSong = songs[currentIndex];
  const isFavorited = favorites.some(fav => fav.name === currentSong.name);
  
  if (isFavorited) {
    playerHeartBtn.classList.remove("empty");
  } else {
    playerHeartBtn.classList.add("empty");
  }
}

createPlaylistBtn.addEventListener("click", () => {
  const playlistName = prompt("Enter new playlist name:");
  if (playlistName && playlistName.trim() !== "") {
    if (!playlists[playlistName]) {
      playlists[playlistName] = [];
      collapsedStates[playlistName] = false;
      renderPlaylists();
      updatePlaylist(); 
    } else {
      alert("A playlist with that name already exists.");
    }
  }
});

function updatePlaylist() {
  const playlistSongs = document.getElementById("playlistSongs");
  playlistSongs.innerHTML = "";
  
  songs.forEach((song, index) => {
    const item = document.createElement("div");
    item.className = "song-item";

    const textZone = document.createElement("div");
    textZone.className = "song-clickable-zone";
    
    textZone.innerHTML = `
      <span class="song-clickable-title">${song.name}</span>
      <span class="song-clickable-sub">${song.artist} • <i style="opacity:0.8">${song.genre}</i></span>
    `;
    
    textZone.addEventListener("click", () => {
      loadSong(index);
      isPlaying = false; 
      togglePlay();
    });

    const actionWrapper = document.createElement("div");
    actionWrapper.className = "add-action-wrapper";

    const addBtn = document.createElement("button");
    addBtn.className = "maroon-pill-btn";
    addBtn.innerHTML = "<span>+</span> Add";
    addBtn.onclick = (e) => {
      e.stopPropagation(); 
      document.querySelectorAll(".playlist-dropdown-menu").forEach(menu => {
        if(menu !== dropdownMenu) menu.classList.remove("show");
      });
      dropdownMenu.classList.toggle("show");
    };

    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "playlist-dropdown-menu";

    const activePlaylists = Object.keys(playlists);
    if (activePlaylists.length === 0) {
      const fallback = document.createElement("div");
      fallback.className = "dropdown-item";
      fallback.style.color = "#666";
      fallback.textContent = "No Playlists Found";
      dropdownMenu.appendChild(fallback);
    } else {
      activePlaylists.forEach(listName => {
        const opt = document.createElement("div");
        opt.className = "dropdown-item";
        opt.textContent = listName;
        opt.onclick = (e) => {
          e.stopPropagation();
          addSongToPlaylistDirect(song, listName);
          dropdownMenu.classList.remove("show");
        };
        dropdownMenu.appendChild(opt);
      });
    }

    actionWrapper.appendChild(addBtn);
    actionWrapper.appendChild(dropdownMenu);
    item.appendChild(textZone);
    item.appendChild(actionWrapper);
    playlistSongs.appendChild(item);
  });
}

function addSongToPlaylistDirect(song, playlistName) {
  if (playlists[playlistName]) {
    const exists = playlists[playlistName].some(s => s.name === song.name);
    if (!exists) {
      playlists[playlistName].push(song);
      collapsedStates[playlistName] = false; 
      renderPlaylists();
    } else {
      alert(`This song is already inside '${playlistName}'!`);
    }
  }
}

function deleteSongFromPlaylist(folderName, songName) {
  playlists[folderName] = playlists[folderName].filter(s => s.name !== songName);
  renderPlaylists();
}

function renderPlaylists() {
  playlistsContainer.innerHTML = "";
  const keys = Object.keys(playlists);
  
  renderPlaylistsDashboardGrid();

  if (keys.length === 0) {
    playlistsContainer.innerHTML = "<p style='color:#666; font-size:14px; margin:5px 0;'>Create a playlist to get started.</p>";
    return;
  }

  keys.forEach(folderName => {
    const folderDiv = document.createElement("div");
    folderDiv.className = "folder";
    
    const folderHeader = document.createElement("div");
    folderHeader.className = "folder-header";
    
    const titleArea = document.createElement("div");
    titleArea.className = "folder-title-area";
    
    const arrowIndicator = document.createElement("span");
    arrowIndicator.className = "folder-arrow";
    arrowIndicator.textContent = collapsedStates[folderName] ? "►" : "▼";
    
    const title = document.createElement("h4");
    title.textContent = folderName;
    
    titleArea.appendChild(arrowIndicator);
    titleArea.appendChild(title);
    folderHeader.appendChild(titleArea);
    
    const delPlaylistBtn = document.createElement("button");
    delPlaylistBtn.textContent = "✕";
    delPlaylistBtn.className = "nav-btn";
    delPlaylistBtn.style.fontSize = "12px";
    delPlaylistBtn.style.color = "#888";
    delPlaylistBtn.onclick = (e) => {
      e.stopPropagation(); 
      if(confirm(`Delete whole playlist '${folderName}'?`)) {
        delete playlists[folderName];
        delete collapsedStates[folderName];
        renderPlaylists();
        updatePlaylist(); 
      }
    };
    folderHeader.appendChild(delPlaylistBtn);
    folderDiv.appendChild(folderHeader);

    const folderContent = document.createElement("div");
    folderContent.className = "folder-content";
    if (collapsedStates[folderName]) {
      folderContent.classList.add("hidden");
    }

    folderHeader.addEventListener("click", () => {
      collapsedStates[folderName] = !collapsedStates[folderName];
      renderPlaylists(); 
    });

    if (playlists[folderName].length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No songs added yet.";
      emptyMsg.style.color = "#555";
      emptyMsg.style.fontSize = "12px";
      emptyMsg.style.margin = "5px 0";
      folderContent.appendChild(emptyMsg);
    }

    playlists[folderName].forEach(song => {
      const songDiv = document.createElement("div");
      songDiv.className = "folder-song";
      
      const nameSpan = document.createElement("span");
      nameSpan.className = "folder-song-title";
      nameSpan.textContent = song.name; 
      nameSpan.style.cursor = "pointer";
      nameSpan.onclick = () => {
        const index = songs.findIndex(s => s.name === song.name);
        if (index !== -1) {
          loadSong(index);
          switchToView('player');
          isPlaying = false;
          togglePlay();
        }
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.className = "nav-btn";
      delBtn.onclick = (e) => {
        e.stopPropagation();
        deleteSongFromPlaylist(folderName, song.name);
      };

      songDiv.appendChild(nameSpan);
      songDiv.appendChild(delBtn);
      folderContent.appendChild(songDiv);
    });

    folderDiv.appendChild(folderContent);
    playlistsContainer.appendChild(folderDiv);
  });
}

function renderFavoritesList() {
  favoritesContainer.innerHTML = "";
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p style='color:#666; font-size:14px; margin:5px 0;'>No favorites added yet.</p>";
    return;
  }

  favorites.forEach(song => {
    const favDiv = document.createElement("div");
    favDiv.className = "song-item";
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "song-clickable-zone";
    nameSpan.textContent = song.name;
    nameSpan.onclick = () => {
      const index = songs.findIndex(s => s.name === song.name);
      if (index !== -1) {
        loadSong(index);
        switchToView('player');
        isPlaying = false;
        togglePlay();
      }
    };

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "🗑️";
    removeBtn.className = "nav-btn";
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      favorites = favorites.filter(fav => fav.name !== song.name);
      renderFavoritesList();
      updateHeartButtonState();
    };

    favDiv.appendChild(nameSpan);
    favDiv.appendChild(removeBtn);
    favoritesContainer.appendChild(favDiv);
  });
}

function addRecent(song) {
  recent = recent.filter(s => s.name !== song.name);
  recent.unshift(song);
  if (recent.length > 8) recent.pop(); 
  localStorage.setItem("recent", JSON.stringify(recent));
  updateRecentList();
  renderRecentDashboardGrid();
}

function updateRecentList() {
  const recentlyPlayed = document.getElementById("recentlyPlayed");
  recentlyPlayed.innerHTML = "";
  recent.forEach(song => {
    const item = document.createElement("div");
    item.className = "song-item";
    item.textContent = song.name;
    item.addEventListener("click", () => {
      const index = songs.findIndex(s => s.name === song.name);
      if (index !== -1) {
        loadSong(index);
        switchToView('player');
        isPlaying = false;
        togglePlay();
      }
    });
    recentlyPlayed.appendChild(item);
  });
}

// Initial Load execution settings
switchToView('home');
renderPlaylists();
renderFavoritesList();
updateRecentList();