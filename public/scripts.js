const username = prompt(`What's your username?`);
const socket = io('http://localhost:9000', {
  query: {
    username: username,
  }
});

let nsSocket = "";

socket.on('nsList', (nsData) => {
  let namespacesDiv = document.querySelector('.namespaces');
  nsData.forEach(({endpoint, title}) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${endpoint}>${title}</div>`
  });

  Array.from(document.getElementsByClassName('namespace')).forEach((el) => {
    el.addEventListener('click', (e) => {
      const nsEndpoint = el.getAttribute('ns');
      joinNS(nsEndpoint)
    })
  });
  joinNS('/wiki');
});
