const io = require('socket.io')();
require('dotenv').config()
const port = process.env.PORT || 8000;

//Initial state that is shared with the client
let state = {
  messages: [],
  onlineUsers: []
}

//Starting a server side connection with socket.io
io.on('connection', (client) => {
  //When user connectes to server add them to OnlineUsers

  client.on('newUser',  (user) => {
    state.onlineUsers.push(user)
    client.on('disconnect', function(){
      state.onlineUsers.splice(state.onlineUsers.indexOf(user), 1)
    });
  })


  //When client callssubscribeSendMessage push the message
  //into the message array
  client.on('subscribeSendMessage', (message) => {
    state.messages.push(message);
  })

  //When Client calls subscribeToMessages update the client to include
  //all the messages from the server
  client.on('subscribeToMessages', (interval) => {
    setInterval(() => {
      client.emit('move', state.messages);
    }, interval);
  })


  //When Client calls subscribeToMessages update the client to include
  //all the messages from the server
  client.on('subscribeToOnlineUsers', (interval) => {
    setInterval(() => {
      client.emit('onlineUsers', state.onlineUsers);
    }, interval);
  })
});

//Lisen to the port that is defined in the dotenv file or default of 8000
io.listen(port);
console.log('listening on port ', port);
