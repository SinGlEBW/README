
// import adapter from 'webrtc-adapter';
let constraints = {
  width: 1920,
  height: 1080,
  aspectRatio: 1.777777778
};


navigator.mediaDevices.getUserMedia({video: true})
.then((mediaStream) => {
  let videoTrack = mediaStream.getVideoTracks()[0];

  // let capture = new ImageCapture(videoTrack);
  // capture.takePhoto().then(async (a)=>{
  //   let stream = await a.stream();
  //   console.dir(await stream.getReader());
  // })


  
  videoTrack.applyConstraints(constraints);

  console.dir(videoTrack.getCapabilities());
 

})

navigator.getUserMedia({video: true}, success, error)

function success (mediaStream) {
  
    let videoTrack = mediaStream.getVideoTracks()[0];
  
    // let capture = new ImageCapture(videoTrack);
    // capture.takePhoto().then(async (a)=>{
    //   let stream = await a.stream();
    //   console.dir(await stream.getReader());
    // })
  

    videoTrack.applyConstraints(constraints);

   console.dir(videoTrack.getCapabilities())
  
}
function error (err) {
 console.dir(err);
}