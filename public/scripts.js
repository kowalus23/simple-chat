const username = prompt(`What's your username?`);
const socket = io('http://localhost:3009', {
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
