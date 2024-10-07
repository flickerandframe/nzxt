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
        console.log(data); // Log the data to see what's being returned
        if (data && data.is_playing) {
            const songTitle = data.item.name;
            const artistName = data.item.artists.map(artist => artist.name).join(', ');
            const albumCoverUrl = data.item.album.images[0].url;

            document.getElementById('song-title').innerText = songTitle;
            document.getElementById('artist-name').innerText = artistName;
            document.getElementById('album-cover').style.backgroundImage = `url('${albumCoverUrl}')`;
            document.getElementById('no-song').classList.add('hidden');
            
            // Update progress bar
            const progress = data.progress_ms; // Get current progress in milliseconds
            const duration = data.item.duration_ms; // Get total duration in milliseconds
            const progressBar = document.getElementById('progress-bar');
            const progressPercentage = (progress / duration) * 100; // Calculate percentage
            progressBar.style.width = `${progressPercentage}%`;
        } else {
            // Handle case when no song is playing
            document.getElementById('no-song').classList.remove('hidden');
        }
    } else {
        console.error('Failed to fetch current track:', response.status);
    }
}
