// Spotify credentials
const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';

// Check if the user has already logged in
if (window.location.hash) {
    const accessToken = window.location.hash.split('&')[0].split('=')[1];
    // Start polling to fetch currently playing song every 5 seconds
    fetchCurrentlyPlaying(accessToken);
    setInterval(() => fetchCurrentlyPlaying(accessToken), 5000); // Poll every 5 seconds
} else {
    // Redirect to Spotify login for authorization
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-currently-playing`;
    window.location.href = authUrl;
}

function fetchCurrentlyPlaying(accessToken) {
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.is_playing) {
            const albumImageUrl = data.item.album.images[0].url;
            const trackName = data.item.name;
            const artistName = data.item.artists.map(artist => artist.name).join(', ');

            // Update the album art and track info if the song changes
            document.getElementById('album-art').src = albumImageUrl;
            document.getElementById('background-blur').style.backgroundImage = `url(${albumImageUrl})`;
            document.getElementById('track-name').textContent = trackName;
            document.getElementById('artist-name').textContent = artistName;
        } else {
            document.getElementById('track-name').textContent = "No track currently playing";
            document.getElementById('artist-name').textContent = "";
            document.getElementById('album-art').src = "";
            document.getElementById('background-blur').style.backgroundImage = "";
        }
    })
    .catch(error => console.error('Error fetching currently playing track:', error));
}
