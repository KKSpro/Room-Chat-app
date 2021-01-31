const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
const io = require('socket.io')(http);
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    const roomid = uuidv4();
    res.redirect(`/` + roomid)
})
app.get('/:room', (req, res) => {
    res.render('index', { roomid: req.params })
    // console.log(req.params);
})
var users = {}
var user2 = {}
io.on('connection', socket => {
    socket.on('join-room', (idroom) => {
        socket.join(idroom);
    })
    socket.on('message', (room, msg) => {

        socket.to(room).broadcast.emit('message', msg);
    })
    socket.on('joined', (room, e) => {
        {
            users[socket.id] = e;
            user2[socket.id] = room;
            socket.to(room).broadcast.emit('join', { user: "System", message: users[socket.id] + " joined the chat" })
        }
    })
    socket.on('disconnect', message => {
        socket.to(user2[socket.id]).broadcast.emit('left', { user: "System", message: users[socket.id] + " left the chat" })
        delete users[socket.id];
        delete user2[socket.id];
    })
    socket.on('typing', (room, msg) => {
        socket.to(room).broadcast.emit('typing', msg);
    })
})








