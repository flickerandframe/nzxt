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

if (accessToken) {
  fetchCurrentlyPlaying();
  setInterval(fetchCurrentlyPlaying, 2000);
  setInterval(updateTimeDisplay, 1000);
}

async function fetchCurrentlyPlaying() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 204 || response.status === 401) {
      localStorage.removeItem('spotifyAccessToken');
      return; // Wait until music starts again before reauthorizing
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
  const songTitle = docume
