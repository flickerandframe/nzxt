// Spotify credentials
const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';

// Variables to track current state
let currentTrack = null;

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
        const placeholderText = document.getElementById('placeholder');

        // Track whether music is playing
        const isPlaying = data && data.is_playing;

        if (isPlaying) {
            const albumImageUrl = data.item.album.images[0].url;
            const track = data.item.name;
            const artist = data.item.artists.map(artist => artist.name).join(', ');

            // Update album art only if the track has changed
            if (currentTrack !== track) {
                currentTrack = track;

                // Fade out all elements simultaneously
                fadeOutAllElements([albumArt, trackName, artistName, backgroundBlur], () => {
                    // Change the album art and background after fading out
                    albumArt.src = albumImageUrl;
                    backgroundBlur.style.backgroundImage = `url(${albumImageUrl})`;

                    // Update text after changing album art
                    trackName.textContent = track;
                    artistName.textContent = artist;

                    // Fade in all elements after changing the album art
                    fadeInAllElements([albumArt, trackName, artistName, backgroundBlur]);
                });
            } else {
                // If the same track is playing, just fade in text if it's hidden
                fadeInText(trackName);
                fadeInText(artistName);
                showPlaceholder(false);
            }
        } else {
            showPlaceholder(true);
        }
    })
    .catch(error => {
        console.error('Error fetching currently playing track:', error);
        showPlaceholder(true);
    });
}

// Function to fade out all elements
function fadeOutAllElements(elements, callback) {
    elements.forEach(element => {
        element.style.opacity = 0; // Fade out
    });
    setTimeout(() => {
        callback(); // Execute the callback after fade-out is complete
    }, 500); // Match with the CSS transition duration
}

// Function to fade in all elements
function fadeInAllElements(elements) {
    elements.forEach(element => {
        element.style.opacity = 1; // Fade in
    });
}

// Function to show or hide the placeholder
function showPlaceholder(show) {
    const placeholderText = document.getElementById('placeholder');
    const albumArt = document.getElementById('album-art');
    const trackName = document.getElementById('track-name');
    const artistName = document.getElementById('artist-name');

    if (show) {
        placeholderText.classList.remove('hidden');
        fadeOutAllElements([albumArt, trackName, artistName, backgroundBlur], () => {
            placeholderText.classList.add('visible');
            fadeInAllElements([placeholderText]);
        });
    } else {
        placeholderText.classList.remove('visible');
        fadeOutAllElements([placeholderText], () => {
            placeholderText.classList.add('hidden');
            fadeInAllElements([albumArt, trackName, artistName, backgroundBlur]);
        });
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
