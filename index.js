const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');

const PORT = process.env.PORT;
const expressServer = app.listen(PORT || 3009, () => {
  console.log(`app is running on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));
const io = socketio(expressServer);

io.on('connection', (socket) => {
  let nsData = namespaces.map(ns => {
    return {
      shortTitle: ns.shortTitle.charAt(0).toUpperCase(),
      title: ns.nsTitle,
      endpoint: ns.endpoint
    }
  });
  socket.emit('nsList', nsData)
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    const username = nsSocket.handshake.query.username;
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);

    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        numberOfUsersCallback(clients.length);
      });

      const nsRoom = namespace.rooms.find(({roomTitle}) => {
        return roomTitle === roomToJoin;
      });

      nsSocket.emit('historyCatchUp', nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);
    });

    nsSocket.on('newMessageToServer', ({text}) => {
      const fullMsg = {
        text: text,
        time: Date.now(),
        username: username,
        avatar: 'https://via.placeholder.com/30'
      };

      const roomTitle = Object.keys(nsSocket.rooms)[1];
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });

      console.log(nsRoom);
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    })
  })
});

const updateUsersInRoom = (namespace, roomToJoin) => {
  io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
  })
};
