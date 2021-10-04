// 1й способ. Обычный http запрос-ответ. Подготовленно для Push Pullinga
let form = document.querySelector('#send-chat');
let view = document.querySelector('.view-response');



window.addEventListener('load', () => {

  let socket = new WebSocket("ws://localhost:4000");
  
  socket.addEventListener('close', (e) => { console.log('Соединение с сервером WS разорвано'); });
  socket.addEventListener('error', (e) => { console.log('Ошибка соединения с сервером WS разорвано'); });

  socket.addEventListener('open', async (e) => { console.log('Соединение с сервером WS установленно');
    socket.send(JSON.stringify({clientID: uuid4()}));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let textArea = e.currentTarget[0];
      socket.send(JSON.stringify({message: textArea.value}))
      textArea.value = '';
    })

    socket.addEventListener('message', (eMessage) => {

      let { message } = JSON.parse(eMessage.data);
      let el = document.createElement('div');
      el.textContent = message;
      el.setAttribute('class', 'view-response__item-msg')
      view.appendChild(el);

    })
     
  })

})


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

