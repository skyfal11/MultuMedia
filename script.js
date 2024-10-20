const API_KEY = 'AIzaSyBp0MSgfDx1aB65SNXYgoTE1yBkfuji5Vk'; 


function searchVideos() {
    const query = document.getElementById('search-bar').value;
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${API_KEY}&maxResults=5`)
        .then(response => response.json())
        .then(data => {
            const videoResults = document.getElementById('video-results');
            videoResults.innerHTML = '';
            data.items.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.classList.add('video-preview');
                videoElement.innerHTML = `
                    <img src="${video.snippet.thumbnails.default.url}" alt="Video Thumbnail">
                    <p>${video.snippet.title}</p>
                `;
                videoElement.addEventListener('click', () => showVideo(video.id.videoId, video.snippet.title, video.snippet.description));
                videoResults.appendChild(videoElement);
            });
        });
}


function showVideo(videoId, title, description) {
    document.getElementById('search-page').style.display = 'none';
    document.getElementById('video-page').style.display = 'block';
    
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.innerHTML = `<iframe width="1124px" height="760px" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    
    document.getElementById('video-title').innerText = title;
    document.getElementById('video-description').innerText = description;

    fetchRelatedVideos(videoId);
}


function fetchRelatedVideos(videoId) {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=${API_KEY}&maxResults=5`)
        .then(response => response.json())
        .then(data => {
            const relatedVideos = document.getElementById('related-videos');
            relatedVideos.innerHTML = '';
            data.items.forEach(video => {
                const relatedVideoElement = document.createElement('div');
                relatedVideoElement.classList.add('related-video');
                relatedVideoElement.innerHTML = `
                    <img src="${video.snippet.thumbnails.default.url}" alt="Video Thumbnail">
                    <p>${video.snippet.title}</p>
                `;
                relatedVideoElement.addEventListener('click', () => showVideo(video.id.videoId, video.snippet.title, video.snippet.description));
                relatedVideos.appendChild(relatedVideoElement);
            });
        });
}


function goBack() {
    document.getElementById('video-page').style.display = 'none';
    document.getElementById('search-page').style.display = 'block';
}
