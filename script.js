const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';
const scopes = ['user-read-playback-state', 'user-read-currently-playing'];
const hash = window.location.hash;
let accessToken = localStorage.getItem('spotifyAccessToken') || null;
const progressCircle = document.getElementById('progress');
const blurBg = document.getElementById('blur-bg');
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
} else {
  console.log("No access token found; redirecting for authorization.");
  redirectToSpotify();
}

async function fetchCurrentlyPlaying() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status === 204 || response.status === 401) {
      localStorage.removeItem('spotifyAccessToken');
      showTimeDisplay();  // Show clock when no song is playing
      return;
    }

    const data = await response.json();
    if (data && data.is_playing) {
      showMusicInfo();
      const trackId = data.item.id;
      if (trackId !== currentTrackId) {
        currentTrackId = trackId;
        updateDisplay(data.item, data.progress_ms, data.item.duration_ms);
      } else {
        updateProgressBar(data.progress_ms, data.item.duration_ms);
      }
    } else {
      showTimeDisplay();
    }
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
    showTimeDisplay(); // Show clock in case of error
  }
}

function updateDisplay(track, progress, duration) {
  const albumCover = document.getElementById('album-cover');
  const songTitle = document.getElementById('song-title');
  const artistName = document.getElementById('artist-name');

  albumCover.src = track.album.images[0].url;
  songTitle.textContent = track.name;
  artistName.textContent = track.artists.map(artist => artist.name).join(', ');
  blurBg.style.backgroundImage = `url(${track.album.images[0].url})`;
  blurBg.classList.remove('clock-bg');

  updateProgressBar(progress, duration); // Update progress bar for song
}

function updateProgressBar(progress, duration) {
  const progressRatio = progress / duration;
  const offset = 1913 * (1 - progressRatio);
  progressCircle.style.strokeDashoffset = offset;
}

function updateTimeDisplay() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const day = now.toLocaleDateString([], { weekday: 'long' });

  document.getElementById('current-time').textContent = time;
  document.getElementById('current-day').textContent = day;
}

function showTimeDisplay() {
  blurBg.classList.add('clock-bg');
  document.getElementById('album-cover').classList.add('hidden');
  document.getElementById('song-title').classList.add('hidden');
  document.getElementById('artist-name').classList.add('hidden');
  document.getElementById('time-display').classList.remove('hidden');
  progressCircle.style.strokeDashoffset = 1913; // Hide progress bar when displaying clock
  blurBg.style.backgroundImage = '';  // Clear album cover background
}

function showMusicInfo() {
  blurBg.classList.remove('clock-bg');
  document.getElementById('album-cover').classList.remove('hidden');
  document.getElementById('song-title').classList.remove('hidden');
  document.getElementById('artist-name').classList.remove('hidden');
  document.getElementById('time-display').classList.add('hidden');
}
