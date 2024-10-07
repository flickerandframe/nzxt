/* Album Art */
#album-art {
    width: 240px;  /* Adjusted size */
    height: 240px; /* Adjusted size */
    border-radius: 15px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    opacity: 0; /* Start hidden */
    transition: opacity 0.5s ease; /* Fade transition for album art */
}

/* Track Name and Artist Name transitions */
.track-info {
    color: white;
    padding: 10px; /* Consistent padding */
}

/* Track Name */
#track-name {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 5px; /* Consistent margin */
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.8); /* Centered drop shadow */
    opacity: 0; /* Start hidden */
    transition: opacity 0.5s ease; /* Transition for fade effect */
}

/* Artist Name */
#artist-name {
    font-size: 20px;
    font-weight: 400;
    color: #b3b3b3;
    text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.8); /* Centered drop shadow */
    opacity: 0; /* Start hidden */
    transition: opacity 0.5s ease; /* Transition for fade effect */
}

/* Placeholder */
.placeholder {
    display: none; /* Hidden by default */
    color: white;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    z-index: 2;
    position: absolute; /* Position it in the center */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0; /* Initial opacity */
    transition: opacity 0.5s ease; /* Added transition for fade effect */
}

.placeholder.visible {
    display: flex;
    opacity: 1; /* Fully visible */
}

.placeholder.hidden {
    opacity: 0; /* Hidden */
    pointer-events: none; /* Prevent interaction when hidden */
}

/* Blurred Background */
.background-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    z-index: 1;
    opacity: 0; /* Start hidden */
    transition: opacity 0.5s ease; /* Fade transition for background */
}

.background-blur.visible {
    opacity: 1; /* Fully visible */
}
