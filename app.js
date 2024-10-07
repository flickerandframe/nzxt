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

            // Crossfade logic
            backgroundBlur.style.backgroundImage = `url(${albumImageUrl})`;
            albumArt.src = albumImageUrl;
            trackName.textContent = track;
            artistName.textContent = artist;

            // Fade in new content
            crossfadeIn(albumArt, trackName, artistName, backgroundBlur);
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

// Function to crossfade in new content
function crossfadeIn(albumArt, trackName, artistName, backgroundBlur) {
    // Reset opacity
    albumArt.style.opacity = 0;
    trackName.style.opacity = 0;
    artistName.style.opacity = 0;
    backgroundBlur.style.opacity = 0;

    // Wait a moment for the opacity to reset before showing new content
    setTimeout(() => {
        albumArt.style.opacity = 1;
        trackName.style.opacity = 1;
        artistName.style.opacity = 1;
        backgroundBlur.style.opacity = 1;
    }, 50); // Wait a tiny bit to create the crossfade effect
}

// Function to show or hide the placeholder
function showPlaceholder(show) {
    const placeholderText = document.getElementById('placeholder');
    const albumArt = document.getElementById('album-art');
    const trackName = document.getElementById('track-name');
    const artistName = document.getElementById('artist-name');

    if (show) {
        placeholderText.style.display = 'flex';
        albumArt.style.opacity = 0; // Hide album art
        trackName.style.opacity = 0; // Hide track name
        artistName.style.opacity = 0; // Hide artist name
    } else {
        placeholderText.style.display = 'none';
        albumArt.style.opacity = 1; // Show album art
        trackName.style.opacity = 1; // Show track name
        artistName.style.opacity = 1; // Show artist name
    }
}

// Update the clock every second
function updateTime() {
    const now = new Date();
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'America/New_York',
    };
    document.getElementById('clock').textContent = now.toLocaleString('en-US', options);
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

// Update the clock every second
setInterval(updateTime, 1000);
