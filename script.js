const accessToken = 'BQAdoZUV_-v8l18PmfFmfHnC8RHQ6q41ZWChLDCObnywsDKzNm6vSE9KO6-_PpqMYSr8Cm_CGHg6m1C9-RE7GAhMBAL7Ed6ungPXXA0WJxlDyftxPE3qICMhx3xUHsrvJXIk3BpTCMjZI-k0xK93Zxn4hE7vvJ2JRzirMXgmp8hRtAkRi9fVT2WK_fiMeY9A4XhKqyEKAq8Yc_MeCzhuLQ'; // Replace with your Spotify access token
const albumCover = document.getElementById('album-cover');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const backgroundBlur = document.getElementById('background-blur');
const albumCoverWrapper = document.getElementById('album-cover-wrapper');
const songInfo = document.getElementById('song-info');
const progressCircle = document.querySelector('svg circle');

let currentTrackId = '';

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
    if (data.item.id !== currentTrackId) {
      currentTrackId = data.item.id;
      crossfade(data);
    }
    updateProgress(data.progress_ms, data.item.duration_ms);
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
  }
}

function crossfade(data) {
  // Fade out current display
  albumCoverWrapper.classList.add('hidden');
  songInfo.classList.add('hidden');
  backgroundBlur.classList.add('hidden');
  
  setTimeout(() => {
    // Update the display
    albumCover.src = data.item.album.images[0].url;
    songTitle.textContent = data.item.name;
    artistName.textContent = data.item.artists.map(artist => artist.name).join(', ');
    backgroundBlur.style.backgroundImage = `url(${data.item.album.images[0].url})`;
    
    // Fade in new display
    albumCoverWrapper.classList.remove('hidden');
    songInfo.classList.remove('hidden');
    backgroundBlur.classList.remove('hidden');
  }, 500); // Wait for fade-out transition
}

function updateProgress(progress, duration) {
  const progressPercent = (progress / duration) * 100;
  const circumference = 2 * Math.PI * 180;
  progressCircle.style.strokeDasharray = `${(circumference * progressPercent) / 100} ${circumference}`;
}

function showFallback() {
  document.getElementById('fallback-info').classList.remove('hidden');
  albumCoverWrapper.classList.add('hidden');
  songInfo.classList.add('hidden');
  backgroundBlur.classList.add('hidden');
}

setInterval(getCurrentlyPlaying, 100); // Refresh every 5 seconds
