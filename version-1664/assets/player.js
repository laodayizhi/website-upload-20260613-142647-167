(function () {
    const video = document.getElementById("movie-video");
    const start = document.getElementById("player-start");
    const streamUrl = window.videoStreamUrl;
    let prepared = false;
    let hls = null;

    if (!video || !start || !streamUrl) {
        return;
    }

    function prepare() {
        if (prepared) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 60
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
        } else {
            video.src = streamUrl;
        }

        prepared = true;
    }

    function begin() {
        prepare();
        start.classList.add("is-hidden");
        video.controls = true;
        const playTask = video.play();

        if (playTask && typeof playTask.catch === "function") {
            playTask.catch(function () {});
        }
    }

    start.addEventListener("click", begin);

    video.addEventListener("click", function () {
        if (video.paused) {
            begin();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
})();
