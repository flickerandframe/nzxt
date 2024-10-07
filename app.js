// Spotify credentials
const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';

// Check if the user has already logged in
if (window.location.hash) {
    const accessToken = window.location.hash.split('&')[0].split('=')[1];
    fetchCurrentlyPlaying(accessToken);
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
            document.getElementById('album-art').src = albumImageUrl;
            document.getElementById('background-blur').style.backgroundImage = `url(${albumImageUrl})`;
            document.getElementById('track-name').textContent = data.item.name;
            document.getElementById('artist-name').textContent = data.item.artists.map(artist => artist.name).join(', ');
        } else {
            document.getElementById('track-name').textContent = "No track currently playing";
            document.getElementById('artist-name').textContent = "";
        }
    })
    .catch(error => console.error('Error fetching currently playing track:', error));
}
