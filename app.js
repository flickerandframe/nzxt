// Spotify credentials
const clientId = 'f472cf64810b419e82483c50e1dd4587'; // Replace with your actual client ID
const redirectUri = 'https://flickerandframe.github.io/nzxt/'; // Replace with your actual redirect URI

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
        const clock = document.getElementById('clock');

        if (data && data.is_playing) {
            const albumImageUrl = data.item.album.images[0].url;
            const track = data.item.name;
            const artist = data.item.artists.map(artist => artist.name).join(', ');

            // Update album art and blurred background
            albumArt.src = albumImageUrl;
            backgroundBlur.style.backgroundImage = `url(${albumImageUrl})`;
            trackName.textContent = track;
            artistName.textContent = artist;

            // Hide clock
            clock.style.display = 'none';
        } else {
            // Show clock when no track is playing
            clock.style.display = 'flex';
            clock.textContent = getCurrentTime();
        }
    })
    .catch(error => {
        console.error('Error fetching currently playing track:', error);
        document.getElementById('clock').style.display = 'flex';
        document.getElementById('clock').textContent = getCurrentTime();
    });
}

// Function to get current time in EST
function getCurrentTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/New_York' };
    return now.toLocaleTimeString('en-US', options);
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

// Update clock every second
setInterval(() => {
    if (document.getElementById('clock').style.display === 'flex') {
        document.getElementById('clock').textContent = getCurrentTime();
    }
}, 1000);
