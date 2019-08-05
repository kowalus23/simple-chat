const express = require('express');
const socketIO = require('socket.io');
let namespaces = require('./data/namespaces');

const app = express();

app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(3001);
const io = socketIO(expressServer);

io.on('connection', (socket) => {
  let nsData = namespaces.map(ns => {
    return {
      shortTitle: ns.shortTitle.charAt(0).toUpperCase(),
      title: ns.nsTitle,
      endpoint: ns.endpoint
    }
  });
  socket.emit('nsList', nsData);
  socket.on('disconnect', () => console.log(`Client disconnected`));
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
        numberOfUsersCallback(clients);
        console.log(clients)
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