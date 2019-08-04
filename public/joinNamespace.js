const joinNS = (endpoint) => {
  if (nsSocket) {
    nsSocket.close();
    document.querySelector('#user-input').removeEventListener('submit', formSubmission)
  }
  nsSocket = io(`${HOST}${endpoint}`);
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = "";
    nsRooms.forEach(({roomTitle, privateRoom}) => {
      let glyph;
      if (privateRoom) {
        glyph = `<i class="fas fa-lock"></i>`
      } else {
        glyph = ''
      }
      roomList.innerHTML += `<li class="room">${roomTitle}<span>${glyph}</span></li>`
    });
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach((el) => {
      el.addEventListener('click', (e) => {
        joinRoom(e.target.innerText)
      })
    });
    const topRoom = document.querySelector('.room');
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName)
  });

  nsSocket.on('messageToClients', (msg) => {
    const newMsg = buildHTML(msg);
    document.querySelector('.font-w-700').innerHTML = msg.username;
    document.querySelector('#messages').innerHTML += newMsg;
  });
  document.querySelector('.message-form').addEventListener('submit', formSubmission)
};

const formSubmission = (event) => {
  event.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  nsSocket.emit('newMessageToServer', {text: newMessage});
};

const buildHTML = ({text, time, username, avatar}) => {
  const convertedDate = new Date(time).toLocaleString();
  const newHTML = `
  <li class="message-wrapper">
     <div class="user-image">
       <img src=${avatar}/>
     </div>
     <div class="user-message">
         <div class="user-name-time"><h4 class="user-name">${username}</h4> <span>${convertedDate}</span></div>
         <div class="message-text">${text}</div>
     </div>
   </li>
  `;
  return newHTML;
};