const joinRoom = (roomName) => {
  nsSocket.emit('joinRoom', (roomName), (newNumberOfMembers) => {
    document.querySelector('.users-number').innerHTML = `${newNumberOfMembers} users in the channel`
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
    let messages = Array.from(document.getElementsByClassName('message-wrapper'));
    messages.forEach((msg) => {
      console.log(msg)
    })
  })
};