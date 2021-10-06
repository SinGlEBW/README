addEventListener('DOMContentLoaded', () => {
  let elVideo = document.getElementById('viewWebRTC');
  let elAudio = document.getElementById('audioWebRTC');
  let elImg = document.getElementById('picture');
//возможные ограничения
  let constraints = {
    video: {advanced:[{height: 150}], height: 300, width: 300},
    audio: true
  }

  document.getElementById("btn-video-start").addEventListener("click", () => {
    videoStart();
  }, false);


  let clientPeerId = uuid4(); 

  let videoStart = () => {
    navigator.mediaDevices.getUserMedia({video: {brightness: 200,height: 500}})
    .then(async (mediaStream) => {
  
      // let videoTrack = mediaStream.getVideoTracks()[0];
      // let audioTrack = mediaStream.getAudioTracks()[0];
      
       mediaStream.onactive = () => {
        console.dir(1);
      }


      let audioTracks = mediaStream.getAudioTracks();
      let videoTracks = mediaStream.getVideoTracks()[0];
      elVideo.srcObject = mediaStream;




      let peerConnection = new RTCPeerConnection({
        iceServers: [{
            urls: "turn:bot.ruitb.ru:5349?transport=tcp",
            username: "telemed1",
            credential: "Lomwe675Df",
            credentialType: "password",
          },
          {
            urls: "stun:stun.stunprotocol.org",
          },
          {
            urls: "turn:bot.ruitb.ru:5349",
            username: "telemed1",
            credential: "Lomwe675Df",
            credentialType: "password",
          },
          {
            urls: "turn:bot.ruitb.ru:3478",
            username: "telemed1",
            credential: "Lomwe675Df",
            credentialType: "password",
          },
          {
            urls: "stun:bot.ruitb.ru:3478",
            username: "telemed1",
            credential: "Lomwe675Df",
            credentialType: "password",
          }],
        iceTransportPolicy: 'relay',
      });

      let dataChanel = peerConnection.createDataChannel('testChanel');



      /*#########----------<{ Event Chanel }>---------###########*/

      dataChanel.addEventListener('open', (e) => {
        console.dir(e);
      });

      dataChanel.addEventListener('message', (e) => {
        console.dir(e);
      });


      
      /*#########----------<{ Event peerConnection }>---------###########
        icecandidate - отрабатывает если вызвали createOffer и передали данные в 
                       peerConnection.setLocalDescription(offerMetaData)
      */

      peerConnection.addEventListener('icecandidate', (e) => {
        console.dir(e);
      })

      /*--------------------------------------------------------------------------------------------*/

      // try {

      //   let offerMetaData =  await peerConnection.createOffer();
      //   peerConnection.setLocalDescription(offerMetaData)
        

      //   console.dir(offerMetaData);
      //   console.dir(peerConnection);

      // } catch (error) {
      //   console.dir(error);
      // }
    
    
    




      let socket = new WebSocket("ws://localhost:4000");
      socket.addEventListener('close', (e) => { console.log('Соединение с сервером WS разорвано'); });
      socket.addEventListener('error', (e) => { console.log('Ошибка соединения с сервером WS разорвано'); });
      socket.addEventListener('open', async (e) => { console.log('Соединение с сервером WS установленно');

        try {
          let offerMetaData = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true});
          peerConnection.setLocalDescription(offerMetaData)
          .then(() => {
            let { sdp, type } = offerMetaData;
            socket.send(JSON.stringify({type, sdp, targetId: clientPeerId}))
          });
        } catch (error) {
          
        }
         

       
   
        socket.addEventListener('message', (e) => {
          //Ответ с сервера 
            
            let data = JSON.parse(e.data);
            if(data.type === 'offer' && data.targetId !== clientPeerId ){
              console.log('targetId:', data.targetId);
              console.log('clientPeerId', clientPeerId);

              peerConnection.setRemoteDescription(data);
              peerConnection.createAnswer()
              .then((answerMetaData) => {
                let { type, sdp } = answerMetaData;
                let answerData = { type, sdp, targetId: clientPeerId };
                peerConnection.setLocalDescription(answerData)
                .then(() => {
                  socket.send(JSON.stringify(answerData))
                });
              })
              
            }else if(data.type === 'answer' && data.targetId !== clientPeerId){
              console.dir(data);
            }
            //  console.dir(data);
           
            // 
        })
      


     
     
  

   
      

    
      //методы peerConnection
     
      

      
      })
    })
  }

    
  videoStart();
 

})

/*
  Blob можно превратить в URL такого вида:
  blob:http://127.0.0.1:5500/ac67d59c-3e02-4cb2-a0df-33a53afeeb2c

  Способ сделать фото с камеры:
      let capture = new ImageCapture(videoTrack);
      capture.takePhoto().then(async (blob)=>{
        let objectURL = URL.createObjectURL(blob);
        console.dir(objectURL);
        elImg.setAttribute('src', objectURL)
      })
*/





/*#########--------<{ WebSocked }>------####### 
extensions: ""
onclose: null
onerror: null
onmessage: null
onopen: null//отрабатывает если есть подключение к ws серверу
//методы
send
close
*/













function uuid4() {
  function hex(s, b) {
      return s +
          (b >>> 4).toString(16) + // high nibble
          (b & 0b1111).toString(16); // low nibble
  }

  var r = crypto.getRandomValues(new Uint8Array(16));

  r[6] = r[6] >>> 4 | 0b01000000; // Set type 4: 0100
  r[8] = r[8] >>> 3 | 0b10000000; // Set variant: 100

  return r.slice(0, 4).reduce(hex, '') +
      r.slice(4, 6).reduce(hex, '-') +
      r.slice(6, 8).reduce(hex, '-') +
      r.slice(8, 10).reduce(hex, '-') +
      r.slice(10, 16).reduce(hex, '-');
}