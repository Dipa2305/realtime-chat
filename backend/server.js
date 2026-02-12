const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });


const userMap = new Map();

function broadcastUserList() {
  const users = Array.from(userMap.values()).map(u => ({
    userId: u.userId,
    username: u.username,
    online: true,
    avatarUrl: u.avatarUrl || '',
  }));
  const msg = JSON.stringify({ type: 'userList', users });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  // console.log('Client connected');

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (e) {
      return;
    }

    if (message.type === 'join') {
      // { type: 'join', userId, username, avatarUrl? }
      userMap.set(ws, {
        userId: message.userId,
        username: message.username,
        avatarUrl: message.avatarUrl || '',
      });
      // console.log('Current userMap:', Array.from(userMap.values()));
      broadcastUserList();
      return;
    }
    if (message.receiverId) {
      wss.clients.forEach(client => {
        const user = userMap.get(client);
        if (
          client.readyState === WebSocket.OPEN &&
          (user?.userId === message.receiverId || user?.userId === message.senderId)
        ) {
          client.send(JSON.stringify(message));
        }
      });
    } else {
    }
  });

  ws.on('close', () => {
    const user = userMap.get(ws);
    userMap.delete(ws);
    broadcastUserList();
    if (user) {
    }
    console.log('Client disconnected');
  });
});

// console.log('WebSocket server running on ws://localhost:8080');
