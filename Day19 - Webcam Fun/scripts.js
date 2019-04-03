const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      //  Deprecated syntax:
      // video.src =  window.URL.createObjectURL(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => console.error('Please Allow Web Cam Access!', err));
}
function redEffect(pixels) {
  // Each pixel takes up 4 spaces in the array:
  // Red, Green, Blue, and Alpha
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200;
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
}
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    let pixels = ctx.getImageData(0, 0, width, height);
    console.log(pixels);
    pixels = redEffect(pixels);
    console.log(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 6000);
}

function takePhoto() {
  // Play the sound
  snap.currentTime = 0;
  snap.play();

  // Take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  console.log(data);

  // Creating a new link in the document for
  // the snapshot
  const link = document.createElement('a');
  link.href = data;

  // Setting image to be downloadable upon click
  link.setAttribute('download', 'snapshot');
  link.textContent = 'Download';

  // Setting the html of the anchor tag
  link.innerHTML = `<img src="${data}" alt="SnapShot"/>`;

  // Inserting each snapshot at the "front of
  // the line" in the strip.
  strip.insertBefore(link, strip.firstChild);
}
getVideo();

video.addEventListener('canplay', paintToCanvas);
