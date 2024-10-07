const accessToken = 'BQB0Kio0HPgPzK_7O_cLmtXjgyvLJo6PlSAXuDLeessW3-h0sPfdMPweOa-RGbBFmhfvUJGJiWeXcxiy9sGmeiGGc0Rht2ph3pR22ngmno6JdZvm4XGQruTZo4vHpPqVyP6TfKHlUZuO1Y6cib4ZIVh906FMM4G5BivbRoQUiRaIYlwmPvjjRmeKuyYA03lM2FC7WKyGY02IfdUtGUATwA'; // Replace with your Spotify access token
async function fetchCurrentlyPlaying() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 204) {
      // No song is currently playing
      displayLastPlayed();
      return;
    }

    const data = await response.json();
    if (data && data.item) {
      const albumCoverUrl = data.item.album.images[0].url;
      const songTitle = data.item.name;
      const artistName = data.item.artists.map(artist => artist.name).join(', ');
      const progress = data.progress_ms;
      const duration = data.item.duration_ms;

      updateSongInfo(albumCoverUrl, songTitle, artistName);
      updateProgress(progress, duration);
    }
  } catch (error) {
    console.error('Error fetching data from Spotify', error);
  }
}

function updateSongInfo(newCover, newTitle, newArtist) {
  const content = document.getElementById('content');
  const albumCover = document.getElementById('album-cover');
  const songTitle = document.getElementById('song-title');
  const artistName = document.getElementById('artist-name');

  content.classList.remove('show');
  content.classList.add('fade');

  setTimeout(() => {
    albumCover.src = newCover;
    songTitle.textContent = newTitle;
    artistName.textContent = newArtist;

    content.classList.remove('fade');
    content.classList.add('show');
  }, 500);
}

function updateProgress(progress, duration) {
  const progressCircle = document.querySelector('.progress-outline circle');
  const circumference = 2 * Math.PI * 195;
  const progressPercent = (progress / duration) * 100;
  progressCircle.style.strokeDasharray = `${(circumference * progressPercent) / 100} ${circumference}`;
}

function displayLastPlayed() {
  // Fetch and display the last played track from Spotify (optional)
}

// Update every 5 seconds
setInterval(fetchCurrentlyPlaying, 100);
fetchCurrentlyPlaying();
