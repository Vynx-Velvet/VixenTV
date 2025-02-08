const videoPlayer = document.getElementById('video-player');
    const guideTableBody = document.getElementById('guide-table-body');
    let hls;

    // Get channels from preload script
    window.api.getChannels().then(channels => {
      populateChannelList(channels);
    });

    function populateChannelList(channels) {
      channels.forEach(channel => {
        console.log(channel);
        const row = guideTableBody.insertRow();
        const nameCell = row.insertCell();
        nameCell.textContent = channel.name;
        nameCell.addEventListener('click', () => playChannel(channel.media));
      });
    }

    function playChannel(source) {
      if (!source) {
        console.error('No media link available.');
        return;
      }

      if (hls) {
        hls.destroy();
      }

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoPlayer.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS.js error:', data);
        });
      } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = source;
        videoPlayer.play();
      } else {
        console.error('HLS is not supported in this browser.');
      }
    }