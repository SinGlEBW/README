addEventListener('DOMContentLoaded', () => {

  let localVideo = document.getElementById('localWebRTC');
  let remoteVideo = document.getElementById('remoteWebRTC');
  let btnStart = document.getElementById("btn-video-start");
  let btnStop = document.getElementById("btn-video-stop");
  let callButton = document.getElementById('btn-video-call')
  let selectChanel = document.getElementById('select-rtc-chanel')

  
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

  let disconnect;
  let connection = true;

  btnStart.addEventListener("click", () => { connection && createConnectP2P() });
  btnStop.addEventListener('click', ()=>{ (typeof disconnect === 'function') && disconnect(); connection = true; })

/*------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------*/

 
 async function createConnectP2P() {

    let mediaStream = await navigator.mediaDevices.getUserMedia({video: {brightness: 200,height: 500}, audio: true});
    let pc = new RTCPeerConnection({ iceServers, iceTransportPolicy: 'relay'});
    let dataChanel = pc.createDataChannel('testChanel', {ordered: true});
    let socket = new WebSocket("ws://localhost:4000");
    let clientId = uuid4();     // caller - вызывающий, callee - вызываемый

    localVideo.srcObject = mediaStream;

    connection = false;
    disconnect = function(){ 
      socket.close();
      mediaStream.getTracks().forEach((track) => track.stop());
      pc.close();
    }


    const sendWS = (payload) => {  socket.send(JSON.stringify(payload)) }
    const toggleChanel = (e) => { sendWS({ type: 'updateChanel', clientId, room: selectChanel.value }); }
   

/*--------------------------------------------------------------------------------------------------*/
 
    pc.addEventListener('datachannel', (e) => { console.dir('Передача канала'); })
    pc.ontrack = (e) => {
      console.log('Получение videoTrack', e);
      // elRemoteVideo.srcObject = e.streams[0];
    }
    // pc.addEventListener('track', (e) => { console.log('Получение videoTrack', e);
    //   elRemoteVideo.srcObject = e.streams[0];
    // })

      /* offer должен создавать вызывающий. Нужно  контролировать это или через серверную сторону или клиентскую  */
    pc.addEventListener('negotiationneeded', async (e) => { console.dir('Создание offer');
      await pc.setLocalDescription(await pc.createOffer());
      socket.addEventListener('open',() => { sendWS({ desc: pc.localDescription }); })
    })   
    pc.addEventListener('icecandidate', ({ candidate }) => { console.log('Событие кандидатов', candidate);
      (candidate) && sendWS({ candidate });
    })

    dataChanel.addEventListener('open', (e) => { console.dir('Канал p2p открыт'); });
    dataChanel.addEventListener('close', (e) => { console.dir('Канал p2p закрыт'); });
    dataChanel.addEventListener('message', (e) => { console.log('Message по p2p: ', e.data); });


    
    socket.addEventListener('close', (e) => { console.log('Соединение с сервером WS разорвано'); selectChanel.removeEventListener('change', toggleChanel); });//
    socket.addEventListener('error', (e) => { console.log('Ошибка соединения с сервером WS разорвано'); });
    socket.addEventListener('open',  (e) => { console.log('Соединение с сервером WS установленно');  console.log(clientId, 'clientId');
      sendWS({ type: 'peer', clientId, room: selectChanel.value });
      selectChanel.addEventListener('change', toggleChanel);
    
   
         

      socket.addEventListener('message', async ({ data }) => {
        let { desc, candidate } = JSON.parse(data);
  
        // console.dir(candidate);  // try {
       
            if (desc) {
              switch (desc.type) {
                case 'offer': 
                mediaStream.getTracks().forEach((track) => {
                  console.log('track', track);
                   pc.addTrack(track, mediaStream)
                });
                  await pc.setRemoteDescription(desc);
                  console.dir(mediaStream.getTracks());
              
                  await pc.setLocalDescription(await pc.createAnswer());
                  sendWS({desc: pc.localDescription});
                  break;
                case 'answer':  await pc.setRemoteDescription(desc); console.dir(desc); break;
                default: break;
              }
            }
           
            else if(candidate){
              console.dir(candidate);
              await pc.addIceCandidate(candidate);
            }

            

          // } 
          // catch (err) { console.error(err); }
     
      })


   
     
      

    })




    return { pc, socket };
  }




/*------------------------------------------------------------------------------------------------------------------------------------------*/



  function createWebSocketConnectTest (pc, socket, sendWS) {

    
    
   
    


 


    const createOffer = async (pc, sendWS, desc) => {
      await pc.setRemoteDescription(desc);
      await pc.setLocalDescription(await pc.createAnswer());
      sendWS({desc: pc.localDescription});
    }

  }






 
})



/*------------------------------------------------------------------------------------------------------------------------------------------ */







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





// function createWebSocketConnect(pc){

//   let socket = new WebSocket("ws://localhost:4000");
//   socket.addEventListener('close', (e) => { console.log('Соединение с сервером WS разорвано'); });
//   socket.addEventListener('error', (e) => { console.log('Ошибка соединения с сервером WS разорвано'); });
//   socket.addEventListener('open',  (e) => {
//     console.log('Соединение с сервером WS установленно'); 
//     let clientId = uuid4();     // caller - вызывающий, callee - вызываемый
 
//     console.log(clientId, 'clientId');
//     const sendWS = (payload) => { socket.send(JSON.stringify(payload)) }
//     sendWS({ type: 'peer', clientId, room: '' });

//     pc.addEventListener('icecandidate', (e) => {
//       (e.candidate) && sendWS({ type: 'candidate', candidate: e.candidate });
//     })


//     socket.addEventListener('message', async ({data, ...e}) => {
//       data = JSON.parse(data);

//       switch (data.type) {
//         case 'peer': (data.clientId !== clientId) && sendWS({type: 'initID', caller: clientId, callee: data.clientId }); break;
//         case 'initID': (data.caller === clientId) && createOffer(pc, sendWS, data); break;          
//         case 'candidate': pc.addIceCandidate(data.candidate); break;      
//         case 'offer': (data.callee === clientId) && createAnswer(pc, sendWS, data); break;
//         case 'answer': (data.caller === clientId) && pc.setRemoteDescription(data); break;
//         default: break;
//       }

//     })

//   })

// }







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