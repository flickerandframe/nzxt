const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';
const scopes = ['user-read-playback-state', 'user-read-currently-playing'];
const hash = window.location.hash;
let accessToken = localStorage.getItem('spotifyAccessToken') || null;
const progressCircle = document.getElementById('progress');
let currentTrackId = null; // To keep track of the current song

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
  setInterval(fetchCurrentlyPlaying, 2000); // Frequent checks for better sync
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
    const trackId = data.item.id; // The ID of the currently playing track
    
    // Only update and fade if the song has changed
    if (trackId !== currentTrackId) {
      currentTrackId = trackId; // Update the current track ID
      updateDisplay(data.item, data.progress_ms, data.item.duration_ms, true);
    } else {
      updateProgressBar(data.progress_ms, data.item.duration_ms); // Only update progress
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

  // Update content directly with no fade if not changing song
  if (fadeIn) {
    content.style.opacity = '0'; // Start faded out

    setTimeout(() => {
      // Set new song details
      albumCover.src = track.album.images[0].url;
      songTitle.textContent = track.name;
      artistName.textContent = track.artists.map(artist => artist.name).join(', ');
      blurBg.style.backgroundImage = `url(${track.album.images[0].url})`;
      
      // Fade in new content
      content.style.opacity = '1';
    }, 300); // Sync with fade transition time
  }

  updateProgressBar(progress, duration);
}

function updateProgressBar(progress, duration) {
  const progressRatio = progress / duration;
  const offset = 1288 * (1 - progressRatio);
  progressCircle.style.strokeDashoffset = offset;
}
