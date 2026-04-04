const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ←←← IMPORTANT: Moved these to the top
const waitingUsers = { random: [], interests: [] };
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // 🔥 SEND USER COUNT
  const sendUserCount = () => {
    io.emit('online-users', connectedUsers.size);
  };

  sendUserCount();

  socket.on('find-match', (data) => {
    const { matchType, interests } = data;
    const user = { socketId: socket.id, interests: interests || [] };

    connectedUsers.set(socket.id, { matchType, currentPartner: null });

    let match = null;

    if (matchType === 'interests') {
      match = findInterestMatch(user);
      if (!match) waitingUsers.interests.push(user);
    } else {
      match = findRandomMatch(user);
      if (!match) waitingUsers.random.push(user);
    }

    if (match) {
      console.log(`🔗 Matched: ${socket.id} ↔ ${match.socketId}`);

      connectedUsers.get(socket.id).currentPartner = match.socketId;
      connectedUsers.get(match.socketId).currentPartner = socket.id;

      socket.emit('matched', { partnerId: match.socketId });
      io.to(match.socketId).emit('matched', { partnerId: socket.id });
    }
  });

  socket.on('offer', (offer) => {
    const userData = connectedUsers.get(socket.id);
    if (userData?.currentPartner) {
      io.to(userData.currentPartner).emit('offer', offer);
    }
  });

  socket.on('answer', (answer) => {
    const userData = connectedUsers.get(socket.id);
    if (userData?.currentPartner) {
      io.to(userData.currentPartner).emit('answer', answer);
    }
  });

  socket.on('ice-candidate', (candidate) => {
    const userData = connectedUsers.get(socket.id);
    if (userData?.currentPartner) {
      io.to(userData.currentPartner).emit('ice-candidate', candidate);
    }
  });

  socket.on('chat-message', (message) => {
    const userData = connectedUsers.get(socket.id);
    if (userData?.currentPartner) {
      io.to(userData.currentPartner).emit('chat-message', message);
    }
  });

  socket.on('next-match', () => {
    const userData = connectedUsers.get(socket.id);
    if (userData?.currentPartner) {
      io.to(userData.currentPartner).emit('user-disconnected');
      if (connectedUsers.has(userData.currentPartner)) {
        connectedUsers.get(userData.currentPartner).currentPartner = null;
      }
      userData.currentPartner = null;
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);

    const userData = connectedUsers.get(socket.id);

    if (userData?.currentPartner) {
      io.to(userData.currentPartner).emit('user-disconnected');
      if (connectedUsers.has(userData.currentPartner)) {
        connectedUsers.get(userData.currentPartner).currentPartner = null;
      }
    }

    waitingUsers.random = waitingUsers.random.filter(u => u.socketId !== socket.id);
    waitingUsers.interests = waitingUsers.interests.filter(u => u.socketId !== socket.id);
    connectedUsers.delete(socket.id);

    // 🔥 UPDATE COUNT
    sendUserCount();
  });
});

// Match functions
function findInterestMatch(user) {
  for (let i = 0; i < waitingUsers.interests.length; i++) {
    const waitingUser = waitingUsers.interests[i];
    if (waitingUser.socketId === user.socketId) continue;

    const common = waitingUser.interests.filter(int => user.interests.includes(int));
    if (common.length > 0) {
      waitingUsers.interests.splice(i, 1);
      return waitingUser;
    }
  }
  return null;
}

function findRandomMatch(user) {
  for (let i = 0; i < waitingUsers.random.length; i++) {
    const waitingUser = waitingUsers.random[i];
    if (waitingUser.socketId === user.socketId) continue;
    waitingUsers.random.splice(i, 1);
    return waitingUser;
  }
  return null;
}

// Routes
app.get('/', (req, res) => res.send('OnlyUs Backend Running'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ OnlyUs Backend running on port ${PORT}`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
});