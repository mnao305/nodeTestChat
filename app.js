const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = process.env.PORT || 7000
const db = require('./db')

db.initDB()

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

io.on('connection', socket => {
  console.log('connected')
  let ip = socket.handshake.address
  showMsg()
  socket.on('message', (inputName, inputMsg) => {
    let name = inputName || 'noName'
    console.log(`name:${name} - message:${inputMsg}`)
    io.emit('message', name, inputMsg)
    db.saveMsg(ip, name, inputMsg)
  })
})

http.listen(PORT, () => {
  console.log(`server listening. Port:${PORT}`)
})

const showMsg = () => {
  const msgs = db.selectMsg()
  console.log(`oioioi ${msgs}`)
}
