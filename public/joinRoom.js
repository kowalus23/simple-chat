const joinRoom = (roomName) => {
  nsSocket.emit('joinRoom', (roomName), (newNumberOfMembers) => {
    document.querySelector('.users-number').innerHTML = `${newNumberOfMembers.length} users in the channel`
  });

  nsSocket.on('historyCatchUp', (history) => {
    const messageUl = document.querySelector('#messages');
    messageUl.innerHTML = "";
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messageUl.innerHTML;
      messageUl.innerHTML = currentMessages + newMsg;
    });
    messageUl.scrollTo(0, messageUl.scrollHeight);
  });

  nsSocket.on('updateMembers', (numMembers) => {
    document.querySelector('.users-number')
      .innerHTML = `${numMembers} users in the channel`;
    document.querySelector('.room-name')
      .innerHTML = roomName;
  });

  let searchBox = document.querySelector('#search-box');
  searchBox.addEventListener('input', (e) => {
    let messageWrapper = Array.from(document.getElementsByClassName('message-wrapper'));
    messageWrapper.forEach((msg) => {
      let messageText = Array.from(msg.getElementsByClassName('message-text'));
      if (messageText[0].innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
        msg.style.display = "none";
      } else {
        msg.style.display = "flex";
      }
    })
  })
};