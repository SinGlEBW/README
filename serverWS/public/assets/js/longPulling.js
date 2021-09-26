// 1й способ. Обычный http запрос-ответ. Подготовленно для Push Pullinga
let form = document.querySelector('#send-chat');
let view = document.querySelector('.view-response');
window.addEventListener('load', () => {
  let listenMessage = () => {
    fetch('http://127.0.0.1:5000/get-message', {
      headers: {'Content-Type': 'application/json'}
    })
    .then(data => data.json())
    .then((data) => {
      let el = document.createElement('div');
      el.textContent = data.msg
      el.setAttribute('class', 'view-response__item-msg')
      view.appendChild(el);
      /*Если серверу есть что отправить, а он отправляет по событию, которое мы на сервере провоцируем
       отправляя с клиента post запрос, запускаем снова эту функцию и ждём возможного ответа */
      listenMessage();//
    })
    .catch(() => {
    //сервер какое-то время подождёт и будет отключаться
    setTimeout(() => { listenMessage() }, 500)
    })
  }
  listenMessage()
  
})

form.addEventListener('submit', function (ev) {
  ev.preventDefault()
  let value = this[0].value
 
  fetch('http://127.0.0.1:5000/send-message', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({msg: value})
  })
  .then(data => data.json())
  .then((data)=>{
    this[0].value = ''
  })
  .catch(() => {
   
  })
})