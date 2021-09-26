/*#########---------<{ Использование WebSocked }>---------######### */

const express = require("express");
const ws = require("ws");
const cors = require("cors");
let PORT = 4000;
const wss = new ws.Server({port: PORT}, () => {
  console.dir('WS Server Started in port: ' + PORT);
});

wss.on('connection', (ws) => {

  //отрабатывает на новый коннект и присваиваем слушатель сообщений
  ws.on('message', (message) =>  {
    // console.dir(message.toString());
    
    /*
      отправка не одному подключённому в данный момент клиенту, а всем клиентам подключённым к ws.
      Т.к. мы можем получить всех законекченых клиентов, мы можем присваивать им id и коннектить 
      определённые id друг с другом, разделив таким образом на комнаты
    */
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({...JSON.parse(message)}))

      // if(client.id === id){
      //   client.send(JSON.stringify({status: true, data: {}}))
      // }

    })

  })
})

/*
  wss - в стоке коннектит только одного клиента
*/
// new ws.Server({
//   backlog,
//   clientTracking,
//   handleProtocols,
//   host: '',
//   maxPayload,
//   noServer,
//   path,
//   perMessageDeflate,
//   port: 4000,
//   server,
//   verifyClient,
// });
