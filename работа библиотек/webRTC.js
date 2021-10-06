
/*Браузеры, поддерживающие WebRTC, имеют 3 основных API
    getUserMedia - для получения данных с устройств audio, video пользователя.
    RTCPeerConnection - для передачи audio, video потока в реальном времени(передача видео аудио с вэб камер)  
    createDataChannel - после соединения аудио видео потока можно обмениваться по доп каналу любыми данными(текст, файлы) 
  Изначально WebRTC рассчитан на соединения типа точка-точка и peer-to-peer.
  Сейчас существует несколько готовых реализаций WebRTC-серверов, организующих сложные 
  групповые конференции между разными браузерами.
  Такие серверы также обеспечивают присоединение к связи с браузерами сторонних устройств — IP-камер,
  использующих протокол RTSP/RTP, а также SIP и H.323-терминалов.
*/
/*1й. Виды устройства. 3 аргумента обязательны */


/*
  1. Некоторые девайсы могут иметь один и тот же id: 'default' поэтому их нет в track девайсов.
    (Например микрофон наушников не показывает, а микрофон web камеры определяет) 
*/

/*ПОЛЕЗНЫЕ МЕТОДЫ */
navigator.mediaDevices.getSupportedConstraints()//список того что поддерживает браузер для передачи данных. это не всегда нужно
navigator.mediaDevices.enumerateDevices()//<-Promise. возвращающего список, имеющихся на машине устройств, в то время как getUserMedia не все.



/*##########-----------<{ Получение видеосигнала }>-----------###########*/

window.navigator.getUserMedia({audio: true, video: true}, success, error);//старый вариант, лучше не использовать

//есть тот же метод, но работающий через промис
navigator.mediaDevices.getUserMedia(constraints);//<-Promise<MediaStream>; новый вариант. имеет подсказки
/* Настройки задаются для того что бы браузер поискал у клиента девайс удовлетворяющий этим настройкам. 
   Девайсов одного типа может быть несколько и не один нас может не устроить, тогда подключения не будет, браузер даже не покажет 
   клиенту popup "Разрешить", "Запретить"  */
constraints = {//(ограничения) запрашиваемых девайсов. (audio, video)
  video: bool || {//MediaTrackConstraints
    advanced: [{//каких характеристик запрашиваем девайс. Считается расширенным ограничением т.к. варианты перечисляем в массиве. 
      /*
        У браузера есть свои жёсткие ограничения, но тут можем задать просьбу для него, найти подходящее устройство. 
        Просьба рассмотрена будет если задана в пределах браузерных ограничениях. Браузер попробует найти самое близкое соответствие.
        */
      aspectRatio: number || {exact: number, ideal: number, max: number, min: number},
      channelCount: number || {exact: number, ideal: number, max: number, min: number},
      deviceId: string || [string] || {exact: string || [string], ideal: string || [string]},//id или [id] устройств которые рассматриваем
      echoCancellation: [bool] || {exact: bool, ideal: bool},
      facingMode: string || [string] || {exact: string || [string], ideal: string || [string]},
      frameRate: number || {exact: number, ideal: number, max: number, min: number},
      groupId: string || [string] || {exact: string || [string], ideal: string || [string]},
      height:  number || {exact: number, ideal: number, max: number, min: number},
      latency: number || {exact: number, ideal: number, max: number, min: number},
      sampleRate: number || {exact: number, ideal: number, max: number, min: number},
      sampleSize: number || {exact: number, ideal: number, max: number, min: number},
      suppressLocalAudioPlayback: bool || {exact: bool, ideal: bool},
      width:  number || {exact: number, ideal: number, max: number, min: number},
    }],
  //здесь задаются текущие настройки девайса, которые будут отображаться в getSettings
    aspectRatio: 1,
    channelCount,
    deviceId,
    echoCancellation,
    facingMode,
    frameRate,
    groupId,
    height,
    latency,
    sampleRate,
    sampleSize,
    suppressLocalAudioPlayback,
    width
    
    
  
  }
}

//для 


.then(mediaStream => {});



/* Основной объект обработки devises */
mediaStream
{
  active: true
  id: "YZBqjmBSTojq74hFP15W7khMn3oAtXljUPVe"//id медиа потока
  onactive: null
  onaddtrack: null
  oninactive: null
  onremovetrack: null

  addTrack: addTrack()
  clone: clone()
  getVideoTracks: getVideoTracks()
  getAudioTracks: getAudioTracks()
  getTrackById: getTrackById()
  getTracks: getTracks()//массив audio video девайсов
  removeTrack: removeTrack()
}





/*###########------------<{ Получение Video девайсов }>------------###########
  Вызвав getVideoTracks() - получаем массив, объектов MediaStreamTrack, устройств:
*/
getVideoTracks()
[{//
  //чтение
  contentHint: "",
  enabled: true,
  id: "2f769ed7-0b32-438e-9670-182464fcaea5",//id устройства
  kind: "video",
  label: "USB Video Device (046d:081b)",
  muted: false,
  readyState: "live",
  //методы
  applyConstraints:  applyConstraints({}),/*<-Promise. опции getUserMedia можно указать тут или дополнить но передав прошлые опции 
                                          applyConstraints({...getConstraints, aspectRatio: 1.5}). Тогда изменение getSettings будут в then данного промиса.
                                          Лучше использовать опции  getUserMedia и не плодить промис в промисе*/
  clone:  clone(),
  getCapabilities:  getCapabilities(),//получить инфо. об ограничении нашего девайса самим браузером. Указывается в max и min значениях.
  getConstraints:  getConstraints(),/*получить инфо. установленных нами ограничений и настроек на девайс. (всё что указывали в getUserMedia для девайса) */
  getSettings:  getSettings(),//текущие настройки, установленные в getUserMedia или auto
  stop: stop(),
  //события
  onended: null,
  onmute: null,
  onunmute: null,
}]


getCapabilities()
{
  aspectRatio: {max: 1280, min: 0.0010416666666666667}
  brightness: {max: 255, min: 0, step: 1}
  colorTemperature: {max: 10000, min: 0, step: 10}
  contrast: {max: 255, min: 0, step: 1}
  deviceId: "e6e56c4b7a7f412f1c488de4a012a0591d32840d50fecd3973be29882d7ea9d9"
  exposureCompensation: {max: 255, min: 0, step: 1}
  exposureMode: (2) ['continuous', 'manual']
  exposureTime: {max: 10000, min: 1.220703125, step: 1.220703125}
  facingMode: []
  frameRate: {max: 30, min: 0}
  groupId: "d3870aaa222d6d4599d4a6f135580dab9e4910d9930a1273d091af3fd0eb8973"
  height: {max: 960, min: 1}
  resizeMode: (2) ['none', 'crop-and-scale']
  saturation: {max: 255, min: 0, step: 1}
  sharpness: {max: 255, min: 0, step: 1}
  whiteBalanceMode: (2) ['continuous', 'manual']
  width: {max: 1280, min: 1}
}


applyConstraints({ height: {min: 480, ideal: 640}})
.then(() => {
  getSettings();
})

getSettings()
{
  aspectRatio: 1.3333333333333333//соотношение сторон
  brightness: 128//яркость
  colorTemperature: 1690//цветовая температура
  contrast: 32//контраст
  deviceId: "8dce52a064b57f849a85c8edc34b0cd8de5568298d76e0bc7c401a831a23f0da"
  exposureCompensation: 192//компенсация экспозиции
  exposureMode: "continuous"//режим экспозиции - непрерывный
  exposureTime: 156.25//время действия
  frameRate: 30//кадров в секунду
  groupId: "fb77d7eb14e03908277626c39c2cf9ac61cb0619a1fd93b7c957940ee860fea1"
  height: 480
  resizeMode: "none"//режим растягивания
  saturation: 32//насыщение
  sharpness: 24//чёткость
  whiteBalanceMode: "continuous"//режим баланса белого
}


/*#########---------<{ Связь 2х клиентов и более }>----------#########
  Что бы получилось связать клиентов нужно знать их публичные(внешние) ip адреса. Эти адреса в основном
  не статичные, а динамические. Есть технология STUN(протокол) который позволяет узнать свой внешний ip адрес и другие метаданные.
  Это внешний сервис, к которому каждый клиент будет обращаться на STUN - SERVER который и подскажет каждому клиенту его информацию. 
  Так же указывают TURN - server (прокси сервер). Это запасной вариант если у  RTCPeerConnection не получается обойти NAT и соединить компы.

  После того как каждый клиент имеет всю необходимую информацию которая потребуется для стыковки клиентов, нам нужно обмениваться данными. 
  Мы выбираем технологию через которую хотим видео-потоком ещё и video потоком. Это скорей будет web socket.
*/

let pc = new RTCPeerConnection(pcOptions);//предоставляет возможность соединить 2 и более устройства, между локальным и удаленным партнером
pcOptions = {
  bundlePolicy: 'balance' || 'max-compat' || 'max-bundle',//определяет как подключить клиентов если у удалённого клиента не поддерживает bundle стандарт
  certificates: [],//передача возможных каких-то сертификатов
  iceCandidatePoolSize,//depricate
  iceServers: [{//принимает массив информации о STUN и TURN серверах для стабильного подключения клиентов
    urls: 'stun: stun4.l.google.com:19302',
    credential: {},
    credentialType,
    username
  },{
    urls: "turn:bot.ruitb.ru:5349?transport=tcp",
    username: "telemed1",
    credential: "Lomwe675Df",
    credentialType: "password",
  }],
  iceTransportPolicy: 'all' || 'relay',
  rtcpMuxPolicy: 'require'//depricate
}


/*После настройки RTCPeerConnection можно отправлять видеопоток через экземпляр pc */
//События
onaddstream: null
onconnectionstatechange: null
ondatachannel: undefined //отрабатывает когда создаётся канал p2p
onicecandidate: null //реагирует когда создаётся запрос и ответ
onicecandidateerror: null
oniceconnectionstatechange: null
onicegatheringstatechange: null
onnegotiationneeded: null
onremovestream: null
onsignalingstatechange: null
ontrack: null

//методы pc
pc.createDataChannel(),

pc.setLocalDescription(metaDataConnect),/*регистрируем передачу видео потока, который провоцирует событие onIceCandidate*/
pc.setRemoteDescription()//
pc.createOffer(),//создать description запроса
pc.createAnswer(),//создать description ответа

pc.addIceCandidate(),//добавление кандидатов при их обмене
pc.addStream(),
pc.addTrack(),
pc.addTransceiver(),
pc.close(),

pc.generateCertificate(),
pc.getConfiguration(),
pc.getIdentityAssertion(),
pc.getReceivers(),
pc.getSenders(),
pc.getStats(),
pc.getStreamById(),
pc.getTransceivers(),
pc.removeStream(),
pc.removeTrack(),
pc.restartIce(),
pc.setConfiguration(),
pc.setIdentityProvider()



/* Принцип работы. Оба клиента создают подключение к STUN серверу (заданный в pcOptions) и получают нужную информацию */
let pc = new RTCPeerConnection(pcOptions);
/* Далее т.к. код отрабатывает один нам нужно контролировать кто будет 1м инициатором соединения, кто 2й и т.д.
  1. Инициатор должен создать "Предложение"(createOffer) указывая что хотим получить видео и аудио.
     После создания нужных мета-данных мы должны их зарегистрировать в setLocalDescription что спровоцирует событие onicecandidate
     
*/

let socket = new WebSocket("ws://localhost:4000");
console.dir(socket);

  pc.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: true}).then((offerMetaData)=>{
    setLocalDescription(offerMetaData)
  })

