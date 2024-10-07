// Spotify credentials
const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';

// Function to fetch currently playing song and update the display
function fetchCurrentlyPlaying(accessToken) {
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        const albumArt = document.getElementById('album-art');
        const trackName = document.getElementById('track-name');
        const artistName = document.getElementById('artist-name');
        const backgroundBlur = document.getElementById('background-blur');
        
        if (data && data.is_playing) {
            const albumImageUrl = data.item.album.images[0].url;
            const track = data.item.name;
            const artist = data.item.artists.map(artist => artist.name).join(', ');

            // Update album art and blurred background
            albumArt.src = albumImageUrl;
            backgroundBlur.style.backgroundImage = `url(${albumImageUrl})`;
            trackName.textContent = track;
            artistName.textContent = artist;

            // Hide placeholder
            showPlaceholder(false);
        } else {
            // Show placeholder if no track is playing
            showPlaceholder(true);
        }
    })
    .catch(error => {
        console.error('Error fetching currently playing track:', error);
        showPlaceholder(true);
    });
}

// Function to show or hide the placeholder
function showPlaceholder(show) {
    const placeholderText = document.getElementById('placeholder');
    const albumArt = document.getElementById('album-art');
    const trackName = document.getElementById('track-name');
    const artistName = document.getElementById('artist-name');
    
    if (show) {
        placeholderText.style.display = 'flex';
        albumArt.style.display = 'none'; // Hide album art when showing placeholder
        trackName.style.display = 'none'; // Hide track name when showing placeholder
        artistName.style.display = 'none'; // Hide artist name when showing placeholder
    } else {
        placeholderText.style.display = 'none';
        albumArt.style.display = 'block'; // Show album art when playing
        trackName.style.display = 'block'; // Show track name when playing
        artistName.style.display = 'block'; // Show artist name when playing
    }
}

// Check if the user has already logged in
if (window.location.hash) {
    const accessToken = window.location.hash.split('&')[0].split('=')[1];
    fetchCurrentlyPlaying(accessToken);
    // Poll every 5 seconds to check for song updates
    setInterval(() => fetchCurrentlyPlaying(accessToken), 5000);
} else {
    // Redirect to Spotify login for authorization
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-currently-playing`;
    window.location.href = authUrl;
}
