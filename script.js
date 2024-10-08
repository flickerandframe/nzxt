const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';
const scopes = ['user-read-playback-state', 'user-read-currently-playing'];
const hash = window.location.hash;
let accessToken = localStorage.getItem('spotifyAccessToken') || null;
const progressCircle = document.getElementById('progress');
let currentTrackId = null;

function redirectToSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  window.location.href = authUrl;
}

if (!accessToken && hash) {
  accessToken = hash.substring(1).split('&').find(el => el.startsWith('access_token')).split('=')[1];
  localStorage.setItem('spotifyAccessToken', accessToken);
  window.location.hash = '';
}

if (!accessToken) {
  redirectToSpotify();
} else {
  fetchCurrentlyPlaying();
  setInterval(fetchCurrentlyPlaying, 100); // Regularly check for updates
  setInterval(updateTimeDisplay, 1000); // Update time every second
}

async function fetchCurrentlyPlaying() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 204 || response.status === 401) {
      localStorage.removeItem('spotifyAccessToken');
      redirectToSpotify();
      return;
    }

    const data = await response.json();
    if (data && data.is_playing) {
      showMusicInfo();
      const trackId = data.item.id;
      if (trackId !== currentTrackId) {
        currentTrackId = trackId;
        updateDisplay(data.item, data.progress_ms, data.item.duration_ms, true);
      } else {
        updateProgressBar(data.progress_ms, data.item.duration_ms);
      }
    } else {
      showTimeDisplay();
    }
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
  }
}

function updateDisplay(track, progress, duration, fadeIn) {
  const albumCover = document.getElementById('album-cover');
  const songTitle = document.getElementById('song-title');
  const artistName = document.getElementById('artist-name');
  const blurBg = document.getElementById('blur-bg');
  const content = document.getElementById('content');

  if (fadeIn) {
    content.style.opacity = '0';
    blurBg.style.opacity = '0';

    setTimeout(() => {
      albumCover.src = track.album.images[0].url;
      songTitle.textContent = track.name;
      artistName.textContent = track.artists.map(artist => artist.name).join(', ');
      blurBg.style.backgroundImage = `url(${track.album.images[0].url})`;

      content.style.opacity = '1';
      blurBg.style.opacity = '1';
    }, 300);
  }

  updateProgressBar(progress, duration);
}

function updateProgressBar(progress, duration) {
  const progressRatio = progress / duration;
  const offset = 1288 * (1 - progressRatio);
  progressCircle.style.strokeDashoffset = offset;

  // Update the time display with seconds
  const totalSeconds = Math.floor(duration / 1000);
  const playedSeconds = Math.floor(progress / 1000);
  const percentage = (playedSeconds / totalSeconds) * 100;
  progressCircle.style.strokeDashoffset = offset * (percentage / 100);
}

function showTimeDisplay() {
  const timeDisplay = document.getElementById('time-display');
  timeDisplay.style.opacity = '0'; // Start with invisible
  document.getElementById('album-cover').classList.add('hidden');
  document.getElementById('song-title').classList.add('hidden');
  document.getElementById('artist-name').classList.add('hidden');
  
  setTimeout(() => {
    timeDisplay.classList.remove('hidden');
    timeDisplay.style.opacity = '1'; // Fade in
  }, 300);
}

function showMusicInfo() {
  const timeDisplay = document.getElementById('time-display');
  timeDisplay.style.opacity = '0'; // Start with invisible
  document.getElementById('album-cover').classList.remove('hidden');
  document.getElementById('song-title').classList.remove('hidden');
  document.getElementById('artist-name').classList.remove('hidden');
  
  setTimeout(() => {
    timeDisplay.classList.add('hidden');
    timeDisplay.style.opacity = '1'; // Fade in
  }, 300);
}
