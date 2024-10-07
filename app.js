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

        if (data && data.is_playing) {
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

                    // Fade in all elements after changing the album art
                    fadeInAllElements([albumArt, trackName, artistName, backgroundBlur], track, artist);
                });
            } else {
                // If the same track is playing, just fade in text if it's hidden
                fadeInText(trackName, track);
                fadeInText(artistName, artist);
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
function fadeInAllElements(elements, track, artist) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = 1; // Fade in
        }, index * 50); // Stagger the fade in a bit
    });
    
    // Update text after fading in
    document.getElementById('track-name').textContent = track;
    document.getElementById('artist-name').textContent = artist;

    // Show blurred background
    document.getElementById('background-blur').classList.add('visible');
}

// Function to show or hide the placeholder
function showPlaceholder(show) {
    const placeholderText = document.getElementById('placeholder');
    const albumArt = document.getElementById('album-art');
    const trackName = document.getElementById('track-name');
    const artistName = document.getElementById('artist-name');

    if (show) {
        placeholderText.classList.remove('hidden');
        placeholderText.classList.add('visible');

        // Fade out track info and album art
        fadeOutAllElements([albumArt, trackName, artistName]);
    } else {
        placeholderText.classList.remove('visible');
        
        // Fade in track info and album art
        fadeInAllElements([albumArt, trackName, artistName], trackName.textContent, artistName.textContent);
        
        // After fade out, hide completely
        setTimeout(() => {
            placeholderText.classList.add('hidden');
            placeholderText.style.display = 'none';
        }, 500); // Match with the CSS transition duration
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
