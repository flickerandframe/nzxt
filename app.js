const clientId = 'f472cf64810b419e82483c50e1dd4587';
const redirectUri = 'https://flickerandframe.github.io/nzxt/';
const scopes = 'user-read-currently-playing user-read-playback-state';
let accessToken;

// Function to authenticate with Spotify and get an access token
function authenticate() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
    window.location.href = authUrl;
}

// Function to get the currently playing track
async function fetchCurrentTrack() {
    if (!accessToken) {
        authenticate();
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        if (data && data.is_playing) {
            const songTitle = data.item.name;
            const artistName = data.item.artists.map(artist => artist.name).join(', ');
            const albumCoverUrl = data.item.album.images[0].url;

            document.getElementById('song-title').innerText = songTitle;
            document.getElementById('artist-name').innerText = artistName;
            document.getElementById('album-cover').style.backgroundImage = `url('${albumCoverUrl}')`;
            document.getElementById('no-song').classList.add('hidden');
        } else {
            // Handle case when no song is playing
            document.getElementById('no-song').classList.remove('hidden');
        }
    } else {
        console.error('Failed to fetch current track:', response.status);
    }
}

// Extract access token from URL
function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.replace('#', '?'));
        accessToken = params.get('access_token');
        history.replaceState(null, null, redirectUri); // Clean URL
        fetchCurrentTrack();
    }
}

// Call this function on page load
getAccessTokenFromUrl();
setInterval(fetchCurrentTrack, 5000); // Update track info every 5 seconds
