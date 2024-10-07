// Spotify credentials
const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';

// Variable to store the currently playing track
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

        // Check if music is playing
        const isPlaying = data && data.is_playing;

        if (isPlaying) {
            const albumImageUrl = data.item.album.images[0].url;
            const track = data.item.name;
            const artist = data.item.artists.map(artist => artist.name).join(', ');

            // If the track has changed
            if (currentTrack !== track) {
                currentTrack = track;

                // Crossfade effect
                crossfadeElements(albumArt, trackName, artistName, backgroundBlur, albumImageUrl, track, artist);
            }
        } else {
            // Show placeholder and time if no track is playing
            showPlaceholder(true);
        }
    })
    .catch(error => {
        console.error('Error fetching currently playing track:', error);
        showPlaceholder(true);
    });
}

// Function to perform crossfade
function crossfadeElements(albumArt, trackName, artistName, backgroundBlur, albumImageUrl, track, artist) {
    // Fade out existing elements
    fadeOutAllElements([albumArt, trackName, artistName, backgroundBlur], () => {
        // Update album art and text content after fade out
        albumArt.src = albumImageUrl;
        backgroundBlur.style.backgroundImage = `url(${albumImageUrl})`;
        trackName.textContent = track;
        artistName.textContent = artist;

        // Fade in the new elements simultaneously
        fadeInAllElements([albumArt, trackName, artistName, backgroundBlur]);
    });
}

// Function to fade out all elements
function fadeOutAllElements(elements, callback) {
    elements.forEach(element => {
        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = 0; // Fade out
    });
    setTimeout(callback, 500); // Execute the callback after fade-out is complete
}

// Function to fade in all elements
function fadeInAllElements(elements) {
    elements.forEach(element => {
        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = 1; // Fade in
    });
}

// Function to show or hide the placeholder
function showPlaceholder(show) {
    const placeholderText = document.getElementById('placeholder');
    const albumArt = document.getElementById('album-art');
    const trackName = document.getElementById('track-name');
    const artistName = document.getElementById('artist-name');
    const backgroundBlur = document.getElementById('background-blur');

    if (show) {
        // Fade out the currently displayed elements
        fadeOutAllElements([albumArt, trackName, artistName, backgroundBlur], () => {
            placeholderText.classList.remove('hidden');
            placeholderText.classList.add('visible'); // Show placeholder
        });
    } else {
        // Fade out the placeholder and show actual track information
        fadeOutAllElements([placeholderText], () => {
            placeholderText.classList.add('hidden'); // Hide placeholder
            fadeInAllElements([albumArt, trackName, artistName, backgroundBlur]);
        });
    }
}

// Function to get the current time in EST
function getCurrentTimeEST() {
    const options = { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
}

// Function to update the time every second
function updateTime() {
    const currentTime = document.getElementById('current-time');
    currentTime.textContent = getCurrentTimeEST();
}

// Check if the user has already logged in
if (window.location.hash) {
    const accessToken = window.location.hash.split('&')[0].split('=')[1];
    fetchCurrentlyPlaying(accessToken);
    // Poll every 5 seconds to check for song updates
    setInterval(() => fetchCurrently
