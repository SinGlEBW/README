/*#########---------<{ Использование WebSocked }>---------######### */


const ws = require("ws");
const cors = require("cors");
let PORT = 4000;
const wss = new ws.Server({port: PORT}, () => {
  console.dir('WS Server Started in port: ' + PORT);
});
let CLIENT = [];
let rooms = [];





wss.on('connection', (ws) => {

  ws.room = [];

  ws.on('message', (message) =>  {

    let data = JSON.parse(message);
    if(typeof data === 'object'){
      switch (data.type){
        case 'initClient': setRoom(data, ws);  break;
          
        default: break;
      }

    }
  

    
    // console.dir(JSON.parse(message));
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

const setRoom = (data, ws) => {
    console.dir(ws);
}

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
