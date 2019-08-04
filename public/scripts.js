const username = prompt(`What's your username?`);

const HOST = `ws://fast-island-63405.herokuapp.com`;
const ws = new WebSocket(HOST);
const el = document.getElementById('server-time');
ws.onmessage = function (event) {
  el.innerHTML = 'Server time: ' + event.data;
};


const socket = io(HOST, {
  query: {
    username: username,
  }
});

let nsSocket = "";

socket.on('nsList', (nsData) => {
  let namespacesDiv = document.querySelector('.namespaces');
  nsData.forEach(({endpoint, title, shortTitle}) => {
    namespacesDiv.innerHTML += `
<div class="namespace-wrapper">
    <small class="namespace-title">${title}</small>
    <div class="namespace" ns=${endpoint}>${shortTitle}</div>
</div>
`
  });

  Array.from(document.getElementsByClassName('namespace')).forEach((el) => {
    el.addEventListener('click', (e) => {
      const nsEndpoint = el.getAttribute('ns');
      joinNS(nsEndpoint)
    })
  });
  joinNS('/mmo');
});
