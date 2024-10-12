const client_id = 'f472cf64810b419e82483c50e1dd4587'; // Your Spotify Client ID
const redirect_uri = 'http://127.0.0.1:3000/c:/Users/isaac/Downloads/j/index.html'; // Your redirect URI (should match your app settings)
const scope = 'user-read-currently-playing user-read-playback-state';
const authEndpoint = 'https://accounts.spotify.com/authorize';

// Access Token
let accessToken = localStorage.getItem('spotifyAccessToken');

// Function to request authorization
function authorize() {
  const url = `${authEndpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=token&show_dialog=true`;
  window.location = url;
}

// Function to extract access token from the URL
function getAccessTokenFromUrl() {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');
    if (token) {
      localStorage.setItem('spotifyAccessToken', token);
      accessToken = token;
      window.history.pushState("", document.title, window.location.pathname); // Remove the token from the URL
    }
  }
}

// Function to get the currently playing song
async function getCurrentlyPlayingTrack() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Check if the response is OK and contains data
    if (response.ok && response.status !== 204) {
      // Ensure the response has a body before trying to parse JSON
      const data = await response.json();
      updateSongInfo(data);
    } else if (response.status === 204) {
      // Spotify returns 204 when no content (i.e., no track is playing)
      console.log('No content available: no song is currently playing.');
      updateSongInfo(null); // Pass null to clear the UI or display a default message
    } else {
      console.log('Error fetching the currently playing track:', response.status);
      if (response.status === 401) {
        authorize(); // Reauthorize if the access token has expired
      }
    }
  } catch (error) {
    console.error('Error fetching track:', error);
  }
}


// Function to update the HTML with song data
function updateSongInfo(data) {
  const currentDate = new Date();

  // Array of days of the week (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get the current day of the week as a string
  const currentDay = daysOfWeek[currentDate.getDay()];
  const contentElement = document.getElementById('content');
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get current time
  const timeDisplay = document.getElementById('timeDisplay');
  const dateText = document.getElementById('date');
  if (data && data.item) {
    contentElement.style.transform = `translateY(${-20}px)`; // Update the translateY value

    const albumImage = data.item.album.images[0].url;
    const songTitle = data.item.name;
    const artistName = data.item.artists.map(artist => artist.name).join(', ');

    // Update HTML elements
    document.getElementById('imageElement').style.backgroundImage = `url('${albumImage}')`;
    document.getElementById('blurred').style.backgroundImage = `url('${albumImage}')`;

    document.getElementById('title').style.opacity = 1;
    document.getElementById('artist').style.opacity = 1;

    document.getElementById('title').innerText = songTitle;
    document.getElementById('artist').innerText = artistName;

    if (data.is_playing) {
      document.getElementById('imageElement').style.opacity = 1;
      timeDisplay.style.opacity = 0; // Hide time display
      dateText.style.opacity = 0; // Hide time display

      document.getElementById('blurred').classList.remove('dimmed');

      // Animate content back to original position (music is playing)
      document.querySelector('.content').classList.remove('shifted');

      // Get duration and current position
      const duration = data.item.duration_ms; // in milliseconds
      const currentPosition = data.progress_ms; // in milliseconds

      // Update the circle based on the current position
      updateCircle(currentPosition, duration);
    } else {
      
      contentElement.style.transform = `translateY(${45}px)`; // Update the translateY value
      // The song is paused
      document.getElementById('title').style.opacity = 0;
      document.getElementById('artist').style.opacity = 0;

      document.getElementById('date').innerText = currentDay;
      dateText.style.opacity = 1; // Hide time display

      timeDisplay.innerText = currentTime;
      timeDisplay.style.opacity = 1; // Show time display

      document.getElementById('blurred').classList.add('dimmed');

      // Shift content down (music is paused)
      document.querySelector('.content').classList.add('shifted');
      document.querySelector('.content').classList.remove('stopped');

      // Reset the circle since the song is paused
      const d = new Date();
      let seconds = d.getSeconds();
      const circle = document.getElementById('animatedCircle');
      circle.style.strokeDashoffset = 31.4 * (60 - seconds); // Reset to full circle
    }
  } else {
    // The song is off
    document.getElementById('imageElement').style.opacity = 0;
    document.getElementById('title').style.opacity = 0;
    document.getElementById('artist').style.opacity = 0;

    document.getElementById('date').innerText = currentDay;
    dateText.style.opacity = 1; // Hide time display

    document.getElementById('blurred').style.backgroundImage = `url('https://www.oilclothbytheyard.com/cdn/shop/products/OliclothByTheYard_Solids_White_grande.jpg?v=1629600894')`;

    timeDisplay.innerText = currentTime;
    timeDisplay.style.opacity = 1; // Show time display

    document.getElementById('blurred').classList.remove('dimmed');

    // Shift the content down (no song playing)
    contentElement.style.transform = `translateY(${227}px)`; // Update the translateY value

    document.querySelector('.content').classList.add('shifted');

    // Reset the circle
    const d = new Date();
    let seconds = d.getSeconds();
    const circle = document.getElementById('animatedCircle');
    circle.style.strokeDashoffset = 31.4 * (60 - seconds); // Reset to full circle
  }
}




// Function to update the circle's closure based on playback position
function updateCircle(currentPosition, duration) {
  const circle = document.getElementById('animatedCircle');
  const circumference = 1884; // This should match your stroke-dasharray value

  // Calculate the offset based on current position
  const offset = circumference - (currentPosition / duration) * circumference;

  // Update the circle's stroke-dashoffset
  circle.style.strokeDashoffset = offset;
}

// Function to reset the circle when no song is playing
function resetCircle() {
  const circle = document.getElementById('animatedCircle');
  circle.style.strokeDashoffset = 1884; // Reset to full circle
}

// On page load, check for an access token and fetch the song info
window.onload = () => {
  getAccessTokenFromUrl(); // Check if token is present in the URL
  if (accessToken) {
    getCurrentlyPlayingTrack();
    setInterval(getCurrentlyPlayingTrack, 500); // Fetch the song every 1 second
  } else {
    authorize(); // If no token, redirect to authorize
  }
};