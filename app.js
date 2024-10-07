const clientId = 'f472cf64810b419e82483c50e1dd4587'; // Replace with your actual client ID
const clientSecret = '2bf86aa82a18444db6abd5fd5819ca93'; // Replace with your actual client secret
const redirectUri = 'https://flickerandframe.github.io/nzxt/'; // Replace with your actual redirect URI

// Function to get an access token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',   

            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)   

        },
        body: 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirectUri
    });

    const data = await response.json();
    return data.access_token;   

}

// Function to fetch current playing track
async function getCurrentTrack(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': 'Bearer   
 ' + accessToken
        }
    });

    const data = await response.json();   

    return data;
}

// Function to fetch recently played tracks
async function getRecentlyPlayedTracks(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/recently-played', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    const data = await response.json();
    return data.items;
}

// Function to update the display
function updateDisplay(currentTrack, recentTracks) {
    document.getElementById('current-song-title').textContent = currentTrack.item.name;
    document.getElementById('current-song-artist').textContent = currentTrack.item.artists[0].name;
    document.querySelector('.current-song img').src = currentTrack.item.album.images[0].url;

    const recentTracksList = document.getElementById('recent-tracks-list');
    recentTracksList.innerHTML = '';
    recentTracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = `${track.track.name} - ${track.track.artists[0].name}`;
        recentTracksList.appendChild(li);
    });
}

// Function to update the clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('clock').textContent = timeString;   

}

// Main function to initialize the application
async function init() {
    // Get the access token (you'll need to implement the authorization flow)
    const accessToken = await getAccessToken();

    // Fetch current playing track and recently played tracks
    const currentTrack = await getCurrentTrack(accessToken);
    const recentTracks = await getRecentlyPlayedTracks(accessToken);

    // Update the display
    updateDisplay(currentTrack, recentTracks);

    // Update the clock every second
    setInterval(updateClock, 1000);
}

// Initialize the application
init();
