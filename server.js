//*keyWords:      //callbacks and recieving //*connection
//clientToClient  //socket.on               //io.on
//clientToServer  //socket.emit
//serverToClient  //socket.broadcast.emit
// socket.emit('serverToClient', "Server: Hello, client!");

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
const io = require('socket.io')(server);

app.use(express.static('client'));

let ActiveUser = {};


io.on('connection', (socket) => {
    console.log(socket.id + " is connected");
  
    socket.on('disconnect', function(){
      console.log(socket.id + " is disconnected");
    })

    socket.on('join', (roomID, userID) =>{
      socket.join(roomID);
      ActiveUser[socket.id] = userID
      io.to(roomID).emit('player', ActiveUser);
      console.log( ActiveUser);
    })

    socket.on('turnPlayer', (boolean, RoomName, ind) =>{
      io.to(RoomName).emit('turn', boolean, ind);
      io.to(RoomName).emit('Unable', socket.id);
    });

});