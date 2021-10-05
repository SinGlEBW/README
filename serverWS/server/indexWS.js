/*#########---------<{ Использование WebSocked }>---------######### */


const ws = require("ws");

let PORT = 4000;
const wss = new ws.Server({port: PORT }, () => {
  console.dir('WS Server Started in port: ' + PORT);
});
let CLIENT = [];
let rooms = [];





wss.on('connection', (ws) => {
<<<<<<< HEAD

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
      
=======
  //отрабатывает на новый коннект и присваиваем слушатель сообщений
  console.dir(wss);
  ws.on('message', (message) =>  {
   
 
   //Отправить всем
    wss.clients.forEach((client) => {
       
>>>>>>> 8e64c7a0dc0e0589139bc780a2b47cbf3929a00c
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

  /*
    отправка не одному подключённому в данный момент клиенту, а всем клиентам подключённым к ws.
    Т.к. мы можем получить всех законекченых клиентов, мы можем присваивать им id и коннектить 
    определённые id друг с другом, разделив таким образом на комнаты
  */