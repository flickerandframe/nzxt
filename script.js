const accessToken = 'BQAdoZUV_-v8l18PmfFmfHnC8RHQ6q41ZWChLDCObnywsDKzNm6vSE9KO6-_PpqMYSr8Cm_CGHg6m1C9-RE7GAhMBAL7Ed6ungPXXA0WJxlDyftxPE3qICMhx3xUHsrvJXIk3BpTCMjZI-k0xK93Zxn4hE7vvJ2JRzirMXgmp8hRtAkRi9fVT2WK_fiMeY9A4XhKqyEKAq8Yc_MeCzhuLQ'; // Replace with your Spotify access token
const albumCover = document.getElementById('album-cover');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const backgroundBlur = document.getElementById('background-blur');
const fallbackInfo = document.getElementById('fallback-info');
const progressCircle = document.getElementById('progress-circle');

async function getCurrentlyPlaying() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (response.status === 204 || response.status > 400) {
      showFallback();
      return;
    }

    const data = await response.json();
    updateDisplay(data);
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
  }
}

function updateDisplay(data) {
  const { item } = data;
  if (item) {
    const albumImage = item.album.images[0].url;
    const title = item.name;
    const artist = item.artists.map(artist => artist.name).join(', ');
    const duration = item.duration_ms;
    const progress = data.progress_ms;

    albumCover.src = albumImage;
    songTitle.textContent = title;
    artistName.textContent = artist;
    backgroundBlur.style.backgroundImage = `url(${albumImage})`;

    // Remove hidden class for fade-in effect
    albumCover.classList.remove('hidden');
    backgroundBlur.classList.remove('hidden');

    updateProgress(progress, duration);
  }
}

function updateProgress(current, duration) {
  const progressPercent = (current / duration) * 100;
  progressCircle.style.backgroundImage = `conic-gradient(#1DB954 ${progressPercent}%, transparent ${progressPercent}%)`;
}

function showFallback() {
  fallbackInfo.style.display = 'block';
  albumCover.classList.add('hidden');  // Fade out album cover
  backgroundBlur.classList.add('hidden');  // Fade out background blur
}

setInterval(getCurrentlyPlaying, 5000);  // Refresh every 5 seconds
