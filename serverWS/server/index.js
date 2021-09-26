/*#########---------<{long pulling}>---------##########*/
const express = require('express');
const cors = require('cors');

const { EventEmitter, errorMonitor } = require('events');
const emitter = new EventEmitter();

let app = express();

app.use(cors(), express.json());
app.use(express.static(`${__dirname}/../public`))
app.get('/get-message', (req, res) => {
  emitter.once('get-message', (body) => { res.status(200).json(body) })
})
app.post('/send-message', (req, res) => {
  console.dir(req.body);
  emitter.emit('get-message', req.body)
  res.status(200).json({});
})

app.listen(5000)