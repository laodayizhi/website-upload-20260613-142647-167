(function () {
    function initMoviePlayer(streamUrl) {
        var stage = document.querySelector('[data-player-stage]');
        var video = document.querySelector('[data-video]');
        var trigger = document.querySelector('[data-play-trigger]');
        var hlsInstance = null;
        if (!stage || !video || !streamUrl) {
            return;
        }
        function attach() {
            if (video.dataset.ready === 'true') {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            video.dataset.ready = 'true';
        }
        function play() {
            attach();
            stage.classList.add('is-playing');
            video.setAttribute('controls', 'controls');
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {});
            }
        }
        if (trigger) {
            trigger.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('ended', function () {
            if (hlsInstance && typeof hlsInstance.stopLoad === 'function') {
                hlsInstance.stopLoad();
            }
        });
    }
    window.initMoviePlayer = initMoviePlayer;
}());
