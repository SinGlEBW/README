addEventListener('DOMContentLoaded', () => {

  let localVideo = document.getElementById('localWebRTC');
  let remoteVideo = document.getElementById('remoteWebRTC');
  let btnStart = document.getElementById("btn-video-start");
  let btnStop = document.getElementById("btn-video-stop");
  let callButton = document.getElementById('btn-video-call')

//возможные ограничения
  let constraints = {
    video: {advanced:[{height: 150}], height: 300, width: 300},
    audio: true
  };

  let iceServers = [{
      urls: "turn:bot.ruitb.ru:5349?transport=tcp",
      username: "telemed1",
      credential: "Lomwe675Df",
      credentialType: "password"
    },
    { urls: "stun:stun.stunprotocol.org" },
    {
      urls: "turn:bot.ruitb.ru:5349",
      username: "telemed1",
      credential: "Lomwe675Df",
      credentialType: "password",
    },{
      urls: "turn:bot.ruitb.ru:3478",
      username: "telemed1",
      credential: "Lomwe675Df",
      credentialType: "password",
    },{
      urls: "stun:bot.ruitb.ru:3478",
      username: "telemed1",
      credential: "Lomwe675Df",
      credentialType: "password",
    }
  ];

  let videoClose;
  btnStart.addEventListener("click", videoStart, false);
  btnStop.addEventListener('click', ()=>{ (typeof videoClose === 'function') && videoClose(); })

/*------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------*/
  
  async function videoStart() {

    let mediaStream = await navigator.mediaDevices.getUserMedia({video: {brightness: 200,height: 500}});
 
    let videoTracks = mediaStream.getVideoTracks()[0];
    videoClose = function(){ videoTracks.stop(); }
    localVideo.srcObject = mediaStream;

    createConnectP2P();
  }


  function createConnectP2P() {

    let peerConnection = new RTCPeerConnection({ iceServers, iceTransportPolicy: 'relay'});
    let dataChanel = peerConnection.createDataChannel('testChanel');
   
   

    /*#########----------<{ Event Chanel }>---------###########*/
    //Открывается соединение после обмена offer, answer  
    
    dataChanel.addEventListener('open', (e) => {
      console.dir('Канал открыт');
    });

    dataChanel.addEventListener('message', (e) => {
      console.log('Message: ', e.data);
    });


    peerConnection.addEventListener('datachannel', (e) => {
      console.dir('Передача канала');
    })
    
    /*#########----------<{ Event peerConnection }>---------###########
      icecandidate - отрабатывает если вызвали createOffer и передали данные в 
                     peerConnection.setLocalDescription(offerMetaData)
    */

    
                  

    createWebSocketConnect(peerConnection);
  }

/*------------------------------------------------------------------------------------------------------------------------------------------*/

  function createWebSocketConnect(peerConnection){

    let socket = new WebSocket("ws://localhost:4000");
    socket.addEventListener('close', (e) => { console.log('Соединение с сервером WS разорвано'); });
    socket.addEventListener('error', (e) => { console.log('Ошибка соединения с сервером WS разорвано'); });
    socket.addEventListener('open',  (e) => {
      console.log('Соединение с сервером WS установленно'); 
      let clientId = uuid4();     // caller - вызывающий, callee - вызываемый
   
      console.log(clientId, 'clientId');
      const sendWS = (payload) => { socket.send(JSON.stringify(payload)) }
      sendWS({ type: 'peer', clientId });

      peerConnection.addEventListener('icecandidate', (e) => {
        // let { caller, callee } = e.target.clientID;
        (e.candidate) && sendWS({ type: 'candidate', candidate: e.candidate });
        
      })


      socket.addEventListener('message', async ({data, ...e}) => {
        data = JSON.parse(data);

        switch (data.type) {
          case 'peer': (data.clientId !== clientId) && sendWS({type: 'initID', caller: clientId, callee: data.clientId }); break;
          case 'initID': (data.caller === clientId) && createOffer(peerConnection, sendWS, data); break;          
          case 'candidate': peerConnection.addIceCandidate(data.candidate); break;      
          case 'offer': (data.callee === clientId) && createAnswer(peerConnection, sendWS, data); break;
          case 'answer': (data.caller === clientId) && peerConnection.setRemoteDescription(data); break;
          default: break;
        }

      })

    })

  }


 

  const createOffer = async (peerC, sendWS, { caller, callee }) => {
    peerC.clientID = { caller, callee };
    let { type, sdp } = await peerC.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });

    await peerC.setLocalDescription({ type, sdp }) 
    sendWS({ type, sdp, caller, callee });
  }

  const createAnswer = async (peerC, sendWS, { caller, callee, ...dataPeer }) => {
    peerC.clientID = { caller, callee };
    await peerC.setRemoteDescription(dataPeer);
    let { type, sdp } = await peerC.createAnswer();
    await peerC.setLocalDescription({ type, sdp }) 
    sendWS({ type, sdp, caller, callee });
  }

 

/*
     peerConnection.setLocalDescription(offerMetaData)
      .then(() => {
        let { sdp, type } = offerMetaData;
        socket.send(JSON.stringify({type, sdp, targetId: clientId}))
      });
    
*/





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