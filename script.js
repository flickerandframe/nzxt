const clientId = 'f472cf64810b419e82483c50e1dd4587';
    const redirectUri = 'https://flickerandframe.github.io/nzxt/';
    const scopes = ['user-read-playback-state', 'user-read-currently-playing'];
    
    // Redirect to Spotify for login if no token is found
    const hash = window.location.hash;
    let accessToken = localStorage.getItem('spotifyAccessToken') || null;
    if (!accessToken && hash) {
      accessToken = hash.substring(1).split('&').find(el => el.startsWith('access_token')).split('=')[1];
      localStorage.setItem('spotifyAccessToken', accessToken);
      window.location.hash = '';
    }

    if (!accessToken) {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    } else {
      fetchCurrentlyPlaying();
      setInterval(fetchCurrentlyPlaying, 5000);
    }

    async function fetchCurrentlyPlaying() {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.status === 204 || response.status === 401) {
          localStorage.removeItem('spotifyAccessToken');
          window.location.reload();
          return;
        }
        
        const data = await response.json();
        updateDisplay(data.item);
      } catch (error) {
        console.error('Error fetching currently playing song:', error);
      }
    }

    function updateDisplay(track) {
      const albumCover = document.getElementById('album-cover');
      const songTitle = document.getElementById('song-title');
      const artistName = document.getElementById('artist-name');
      const content = document.getElementById('content');
      const display = document.getElementById('display');

      content.classList.add('fade');
      setTimeout(() => {
        albumCover.src = track.album.images[0].url;
        songTitle.textContent = track.name;
        artistName.textContent = track.artists.map(artist => artist.name).join(', ');
        display.style.backgroundImage = `url(${track.album.images[0].url})`;

        content.classList.remove('fade');
      }, 500);
    }
