var PORT = 8081;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(PORT);
console.log("app listen at " + PORT);

var Room = require('./Room');

var rooms = [new Room(1, '1', 'hello'), new Room(2, 'Have a happy day!'), new Room(3, 'Welcome to gameZone')];

/***************************HTTP REQUEST*****************************/

app.use(express.json());
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.post('/login', (req, res) => {
  console.log(req.body);
  if (req.body.username === req.body.password) {
    for(var i=0;i<rooms.length;i++){
      var ulist = rooms[i].list;
      for(var j=0;j<ulist.length;j++){
        if(ulist[j].username===req.body.username){
          res.send({ success: false });
          return;
        }
      }
    }
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

app.get('/roomlist', (req, res) => {
  let sendData = {
    roomlist: rooms.map(room => {
      return {
        id: room.id,
        name: room.name,
        member_num: room.member_num,
        create_time: room.create_time,
        description: room.description,
      };
    })
  }
  res.send(sendData);
})

/********************************************************************/
/*******************************SOCKET*******************************/

io.on('connection', function (socket) {
  var username, room_id, room, users;

  socket.on('login', function (data) {
    console.log('login', data);
    var isNewUser = true;
    username = data.username;
    room_id = data.room_id;
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].id === room_id) {
        room = rooms[i];
        users = room.list;
        break;
      }
    }

    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        isNewUser = false;
        break;
      } else {
        isNewUser = true;
      }
    }
    if (isNewUser) {
      console.log('newUser', username);
      room.add({
        username: username,
        socket: socket
      });
      users.forEach(user => {
        user.socket.emit('add', { username: username });
      });
      //io.sockets.emit('add', { username: username });
      var userlist = users.map(user => {
        return { username: user.username };
      });
      socket.emit('loginSuccess', { userlist: userlist });
    } else {
      socket.emit('loginFail', {});
    }
  });

  socket.on('sendMessage', (data) => {
    console.log('sendMessage', data);
    socket.emit('sendMessageSuccess', {});
    users.forEach(user => {
      user.socket.emit('receiveMessage', data);
    })
  });

  socket.on('disconnect', () => {
    console.log('disconnect', username);
    room.minus({ username: username }, function (member1, member2) {
      return member1.username === member2.username;
    });
    users.forEach(user => {
      user.socket.emit('leave', username);
    });
  });
});
