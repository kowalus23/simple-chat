const username =  prompt(`What's your username?`);
const socket = io('http://localhost:9000', {
  query: {
    username: username,
  }
});
