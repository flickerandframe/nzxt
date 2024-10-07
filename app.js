const clientId = 'f472cf64810b419e82483c50e1dd4587';
const clientSecret = '2bf86aa82a18444db6abd5fd5819ca93';
const refreshToken = 'AQCqUMwvhZvLGN2Lw7LrSqFuuArGHYHfl9kFwtiHKL9Dr49yFRUnzv7ExS5jGM0bQhJxhRsJczsxNqLKTaFVV8H2y4fLNgcLA-fP9cpiDt54kauruyC4mrKKJEuSJu206M0';

const authUrl = 'https://accounts.spotify.com/api/token';
const playerUrl = 'https://api.spotify.com/v1/me/player/currently-playing';

const albumCover = document.getElementById('album-cover');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const progressBar = document.querySelector('.progress-bar');

// Fetch Spotify data
async function fetchSpotifyData() {
  try {
    const token = await getAccessToken();
    const response = await fetch(playerUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204 || response.status === 200) {
      const data = await response.json();
      updateUI(data);
    } else {
      showFallbackUI();
    }
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
  }
}

// Update the UI with the song data
function updateUI(data) {
  const album = data.item.album;
  const song = data.item.name;
  const artist = data.item.artists.map((a) => a.name).join(', ');

  albumCover.src = album.images[0].url;
  songTitle.textContent = song;
  artistName.textContent = artist;

  // Update progress bar and animations
  const duration = data.item.duration_ms;
  const progress = data.progress_ms;
  animateProgressBar(progress, duration);

  // Crossfade handling (use opacity transitions)
}

// Animate the circular progress bar
function animateProgressBar(progress, duration) {
  const progressRatio = (progress / duration) * 100;
  progressBar.style.strokeDasharray = `${progressRatio} 100`;
}

// Show fallback UI when no music is playing
function showFallbackUI() {
  const fallbackContent = document.querySelector('.fallback-content');
  fallbackContent.style.display = 'block';
  updateClock();
}

// Update the time display in fallback
function updateClock() {
  const timeDisplay = document.getElementById('time-display');
  const now = new Date();
  timeDisplay.textContent = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

fetchSpotifyData();
setInterval(fetchSpotifyData, 500); // Refresh every 30 seconds
