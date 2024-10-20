// Получение токена доступа к Spotify API
const clientId = '7c278768d3ee4cd8b950abd6b7e73da1';
const clientSecret = '52823fcf1a544a8b990e67f3d04239ea'; // Тебе нужно заменить на свой клиентский секрет

let accessToken = '';

async function getSpotifyToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    accessToken = data.access_token;
}

async function searchTracks() {
    const query = document.getElementById('search-bar').value;
    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await result.json();
    const trackResults = document.getElementById('track-results');
    trackResults.innerHTML = '';

    data.tracks.items.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.classList.add('track-item');
        trackItem.innerHTML = `
            <img src="${track.album.images[0].url}" alt="Album Art" width="50" height="50">
            <div>${track.name}</div>
        `;
        trackItem.onclick = () => selectTrack(track);
        trackResults.appendChild(trackItem);
    });
}

function selectTrack(track) {
    document.getElementById('search-page').classList.add('hidden');
    document.getElementById('player-page').classList.remove('hidden');

    document.getElementById('track-title').textContent = track.name;
    document.getElementById('album-artwork').innerHTML = `<img src="${track.album.images[0].url}" alt="Album Art">`;

    const audio = new Audio(track.preview_url);
    audio.play();

    const playButton = document.getElementById('play-button');
    let isPlaying = true;

    playButton.onclick = function() {
        if (isPlaying) {
            audio.pause();
            playButton.textContent = 'Play';
        } else {
            audio.play();
            playButton.textContent = 'Pause';
        }
        isPlaying = !isPlaying;
    };

    audio.ontimeupdate = function() {
        document.getElementById('track-timeline').value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('current-time').textContent = formatTime(audio.currentTime);
        document.getElementById('total-time').textContent = formatTime(audio.duration);
    };
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function showSearchPage() {
    document.getElementById('player-page').classList.add('hidden');
    document.getElementById('search-page').classList.remove('hidden');
}

// Получение токена при загрузке страницы
getSpotifyToken();
