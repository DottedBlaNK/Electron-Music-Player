// renderer.js
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const jsmediatags = require('jsmediatags'); // You'll need to install this: npm install jsmediatags

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progress-bar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playlistEl = document.getElementById('playlist');
const selectFolderBtn = document.getElementById('selectFolder');

// App State
let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let playedHistory = [];

// Initialize app
audioPlayer.volume = volumeSlider.value;

// Event Listeners
selectFolderBtn.addEventListener('click', async () => {
  const musicFiles = await ipcRenderer.invoke('open-folder-dialog');
  if (musicFiles.length > 0) {
    songs = musicFiles;
    renderPlaylist();
    loadSong(0);
  }
});

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);
shuffleBtn.addEventListener('click', toggleShuffle);
volumeSlider.addEventListener('input', adjustVolume);
progressBar.addEventListener('click', seek);

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', () => {
  playNext();
});

// Functions
function renderPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.className = 'playlist-item';
    if (index === currentSongIndex) {
      li.classList.add('active');
    }
    
    li.innerHTML = `
      <span class="playlist-item-title">${song.name}</span>
    `;
    
    li.addEventListener('click', () => {
      loadSong(index);
      playAudio();
    });
    
    playlistEl.appendChild(li);
  });
}

function loadSong(index) {
  if (songs.length === 0) return;
  
  currentSongIndex = index;
  const songPath = songs[currentSongIndex].path;
  audioPlayer.src = songPath;
  
  // Update song title from filename
  songTitle.textContent = songs[currentSongIndex].name;
  artistName.textContent = 'Loading metadata...';
  
  // Set default album art
  albumArt.src = 'placeholder-album.jpg';
  
  // Try to get metadata using jsmediatags
  jsmediatags.read(songPath, {
    onSuccess: function(tag) {
      console.log('Tag read successfully:', tag);
      
      // Extract title and artist if available
      if (tag.tags.title) {
        songTitle.textContent = tag.tags.title;
      }
      
      if (tag.tags.artist) {
        artistName.textContent = tag.tags.artist;
      } else {
        artistName.textContent = 'Unknown Artist';
      }
      
      // Extract album art if available
      if (tag.tags.picture) {
        const { data, format } = tag.tags.picture;
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        albumArt.src = `data:${format};base64,${window.btoa(base64String)}`;
      }
    },
    onError: function(error) {
      console.error('Error reading tags:', error);
      artistName.textContent = 'Unknown Artist';
    }
  });
  
  // Update playlist active item
  document.querySelectorAll('.playlist-item').forEach((item, idx) => {
    if (idx === currentSongIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function togglePlayPause() {
  if (songs.length === 0) return;
  
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function playAudio() {
  audioPlayer.play();
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseAudio() {
  audioPlayer.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function playNext() {
  if (songs.length === 0) return;
  
  // Add current song to history
  playedHistory.push(currentSongIndex);
  
  let nextIndex;
  if (isShuffle) {
    // Get random index that's not the current one
    let availableIndices = Array.from({ length: songs.length }, (_, i) => i)
      .filter(i => i !== currentSongIndex);
    
    if (availableIndices.length === 0) {
      // If only one song in playlist, just replay it
      nextIndex = currentSongIndex;
    } else {
      // Get random index from available indices
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }
  } else {
    // Just go to the next song
    nextIndex = (currentSongIndex + 1) % songs.length;
  }
  
  loadSong(nextIndex);
  playAudio();
}

function playPrevious() {
  if (songs.length === 0) return;
  
  // If we're more than 3 seconds into the song, restart it
  if (audioPlayer.currentTime > 3) {
    audioPlayer.currentTime = 0;
    return;
  }
  
  // Check if we have history to go back to
  if (playedHistory.length > 0) {
    const prevIndex = playedHistory.pop();
    loadSong(prevIndex);
  } else {
    // If no history, go to previous song
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1;
    loadSong(prevIndex);
  }
  
  playAudio();
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active');
  
  if (isShuffle) {
    shuffleBtn.style.color = '#1DB954';
  } else {
    shuffleBtn.style.color = '#b3b3b3';
  }
}

function adjustVolume() {
  audioPlayer.volume = volumeSlider.value;
}

function updateProgress() {
  const { currentTime, duration } = audioPlayer;
  
  if (isNaN(duration)) return;
  
  // Update progress bar
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  
  // Update time display
  currentTimeEl.textContent = formatTime(currentTime);
  totalTimeEl.textContent = formatTime(duration);
}

function seek(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;
  
  audioPlayer.currentTime = (clickX / width) * duration;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}