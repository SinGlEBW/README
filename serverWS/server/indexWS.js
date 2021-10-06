/*#########---------<{ Использование WebSocked }>---------######### */


const ws = require("ws");

let PORT = 4000;
let clients = [];

Array.prototype.clearInx = (arrItem) => clients.findIndex((item, i) => (item.ws === arrItem) && clients.splice(i, 1))//меняет основной массив clients

const wss = new ws.Server({port: PORT }, () => {
  console.dir('WS Server Started in port: ' + PORT);
});


wss.on('connection', (ws) => {
  //отрабатывает на новый коннект и присваиваем слушатель сообщений
 
  clients.push({ws});
  ws.on('message', (message) =>  {
    let data = JSON.parse(message);

  //   if(typeof data === 'object'){
  //     if(data.type === 'peer' && data.clientId){
  //       clients.forEach((item) => { (item.ws === ws && !item.clientId) && Object.assign(item, data) })
  //     }
      
  //     console.dir(clients);
  //   }



   //Отправить всем
    if(clients.length > 1){
      clients.forEach((client) => {
       ( client.ws !== ws ) && client.ws.send(JSON.stringify(data))
  
        // if(client.id === id){
        //   client.send(JSON.stringify({status: true, data: {}}))
        // }
  
      })
    }

    // wss.clients.forEach((client) => {
    //   console.dir(client);
    //   client.send(JSON.stringify(data))
    // })






   

  })
  ws.on('close', (codeClose) => { clients.clearInx(ws); console.log('ws close', clients); })



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

  /*
    отправка не одному подключённому в данный момент клиенту, а всем клиентам подключённым к ws.
    Т.к. мы можем получить всех законекченых клиентов, мы можем присваивать им id и коннектить 
    определённые id друг с другом, разделив таким образом на комнаты
  */