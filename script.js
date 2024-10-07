const accessToken = 'BQAdoZUV_-v8l18PmfFmfHnC8RHQ6q41ZWChLDCObnywsDKzNm6vSE9KO6-_PpqMYSr8Cm_CGHg6m1C9-RE7GAhMBAL7Ed6ungPXXA0WJxlDyftxPE3qICMhx3xUHsrvJXIk3BpTCMjZI-k0xK93Zxn4hE7vvJ2JRzirMXgmp8hRtAkRi9fVT2WK_fiMeY9A4XhKqyEKAq8Yc_MeCzhuLQ'; // Replace with your Spotify access token

// Function to fetch the currently playing song
async function getCurrentlyPlaying() {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  if (response.status === 204 || response.status > 400) {
    showFallback();
    return;
  }
  
  const data = await response.json();
  updateDisplay(data);
}

// Function to update the UI with song info
function updateDisplay(data) {
  const albumCover = document.getElementById('album-cover');
  const songTitle = document.getElementById('song-title');
  const artistName = document.getElementById('artist-name');
  const backgroundBlur = document.querySelector('.background-blur');
  
  albumCover.src = data.item.album.images[0].url;
  songTitle.textContent = data.item.name;
  artistName.textContent = data.item.artists.map(artist => artist.name).join(', ');
  backgroundBlur.style.backgroundImage = `url(${data.item.album.images[0].url})`;
  
  // Additional: Start the progress circle and crossfade here
}

function showFallback() {
  document.querySelector('.fallback-info').style.display = 'block';
  document.querySelector('.content').style.display = 'none';
  // Update fallback info with the last played song
}

function updateProgress() {
  // Calculate and animate the progress circle
}

setInterval(getCurrentlyPlaying, 5000); // Refresh every 5 seconds
