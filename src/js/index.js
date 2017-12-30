
import './tracking-min';
import './face-min';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

!function() {

  let img = new Image();
  img.src = '../img/Laughing_man.png';

  let imgWidth, imgHeight;

  img.onload = () => {
    console.log(img.width, img.height);
    imgWidth = img.width;
    imgHeight = img.height;
  }

  const canvas = document.getElementById('myOverlay');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#0F0';
  ctx.lineWidth = 1;

  const video = document.getElementById('myVideo');
  let track;

  const playCamera = () => {
    navigator.getUserMedia(
      {
        video: true,
        audio: false
      },
      stream => {
        video.srcObject = stream;
        video.src = window.URL.createObjectURL(stream);
        track = stream.getTracks()[0]
      },
      err => console.warn(err)
    );
  }
  playCamera();

  const play = document.getElementById('btn-play');
  play.addEventListener('click', e => {
    console.log('play');
    playCamera();
  });

  const stop = document.getElementById('btn-stop');
  stop.addEventListener('click', e => {
    console.log('stop');
    track.stop();
  });

  const objects = new tracking.ObjectTracker(['face']);

  objects.on('track', e => {
    // console.log(e)
    ctx.clearRect(0, 0, 800, 600);

    if (e.data.length === 0) {
      // No objects were detected in this frame.
    } else {
      e.data.forEach(rect => {
        let width, height;
        if (rect.width > rect.height) {
          width = rect.width;
          height = rect.width * imgHeight / imgWidth;
        } else {
          width = rect.height * imgWidth / imgHeight;
          height = rect.height;
        }
        ctx.beginPath();
        ctx.strokeRect(rect.x * 2, rect.y * 2, rect.width * 2, rect.height * 2);
        ctx.drawImage(img, rect.x * 2, rect.y * 2, width * 2, height * 2);
      });
    }
  });

  tracking.track('#myVideo', objects);

}();