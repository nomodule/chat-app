const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  socket.on('join', ({ username }, cb) => {
    const { error, user } = addUser({ id: socket.id, username })

    if (error) {
      return cb(error)
    }

    socket.emit('message', generateMessage(user.username, ' Welcome!'))
    socket.broadcast.emit(
      'message',
      generateMessage(`${user.username} has joined!`)
    )

    io.emit('onlineUsers', {
      users: getUsers()
    })

    cb()
  })

  socket.on('sendMessage', (message, cb) => {
    const user = getUser(socket.id)
    const filter = new Filter()

    if (filter.isProfane(message)) {
      return cb('Profanity is not allowed')
    }

    io.emit('message', generateMessage(user.username, message))
    cb()
  })

  socket.on('sendLocation', (coords, cb) => {
    const user = getUser(socket.id)

    io.emit(
      'locationMessage',
      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    )
    cb()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.emit('message', generateMessage('Admin', `${user.username} has left`))
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add)
})
