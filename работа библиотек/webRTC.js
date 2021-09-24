
/*Браузеры, поддерживающие WebRTC, имеют функцию getUserMedia, для получения данных с устройств audio, video пользователя.

  Изначально WebRTC рассчитан на соединения типа точка-точка и peer-to-peer.
  Сейчас существует несколько готовых реализаций WebRTC-серверов, организующих сложные 
  групповые конференции между разными браузерами.
  Такие серверы также обеспечивают присоединение к связи с браузерами сторонних устройств — IP-камер,
  использующих протокол RTSP/RTP, а также SIP и H.323-терминалов.
*/
/*1й. Виды устройства. 3 аргумента обязательны */


audio: {
  optional: [{
    sourceId: audioSource
  }]
}
video: {
  optional: [{
    sourceId: videoSource
  }]
}



window.navigator.getUserMedia({audio: true, video: true}, success, error);//старый вариант

//есть тот же метод, но работающий через промис
navigator.mediaDevices.getUserMedia({ video: true })//новый вариант. имеет подсказки

navigator.mediaDevices.getSupportedConstraints()//список того что поддерживает браузер для передачи данных. это не всегда нужно
navigator.mediaDevices.enumerateDevices()//можно не использовать т.к. getUserMedia имеет информацию
.then(mediaStream => {});


function success(pLocalMediaStream) {
    /* обработка видеопотока */

    {
      active: true
      id: "YZBqjmBSTojq74hFP15W7khMn3oAtXljUPVe"//id медиа потока
      onactive: null
      onaddtrack: null
      oninactive: null
      onremovetrack: null
   
      addTrack: addTrack()
      clone: clone()
      getAudioTracks: getAudioTracks()
      getTrackById: getTrackById()
      getTracks: getTracks()
      getVideoTracks: getVideoTracks()
      removeTrack: removeTrack()

    }
}

function error(pError) {
    /* вывод ошибки */
    console.log(pError);
}



/*###########------------<{ Методы Video }>------------###########
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
  applyConstraints:  applyConstraints(),
  clone:  clone(),
  getCapabilities:  getCapabilities(),//получить информацию о мин. и мак. значениях которые можно менять в настройках устройства через applyConstraints.
  getConstraints:  getConstraints(),/*получить возможную ограничивающую информацию User-Agent 
                                     (то есть: Браузера или бота или любой другой программы с выходом в интернет) , если есть.не поддерживает FireFox */
  getSettings:  getSettings(),//текущие настройки
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


applyConstraints({
  height: {min: 480, ideal: 640}
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


