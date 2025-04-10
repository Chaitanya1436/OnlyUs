const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});






io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // Handle when users want to find a match
    socket.on('find-match', (data) => {
      const { matchType, interests } = data;
      
      // Create user object
      const user = {
        socketId: socket.id,
        interests: interests || []
      };
      
      // Add user to connected users map
      connectedUsers.set(socket.id, { matchType, currentPartner: null });
      
      let match = null;
      
      // Find match based on match type
      if (matchType === 'interests') {
        match = findInterestMatch(user);
        
        if (!match) {
          // No match found, add to waiting list
          waitingUsers.interests.push(user);
          console.log(`User ${socket.id} added to interests waiting room`);
        }
      } else {
        // Random matching
        match = findRandomMatch(user);
        
        if (!match) {
          // No match found, add to waiting list
          waitingUsers.random.push(user);
          console.log(`User ${socket.id} added to random waiting room`);
        }
      }
      
      // If match found, establish connection
      if (match) {
        console.log(`Matched users: ${socket.id} and ${match.socketId}`);
        
        // Update connected users map with partner info
        connectedUsers.get(socket.id).currentPartner = match.socketId;
        
        if (connectedUsers.has(match.socketId)) {
          connectedUsers.get(match.socketId).currentPartner = socket.id;
        }
        
        // Notify both users of the match
        socket.emit('matched', { partnerId: match.socketId });
        io.to(match.socketId).emit('matched', { partnerId: socket.id });
      }
    });
    
    // Handle WebRTC signaling for offers
    socket.on('offer', (offer) => {
      const userData = connectedUsers.get(socket.id);
      if (userData && userData.currentPartner) {
        io.to(userData.currentPartner).emit('offer', offer);
      }
    });
    
    // Handle WebRTC signaling for answers
    socket.on('answer', (answer) => {
      const userData = connectedUsers.get(socket.id);
      if (userData && userData.currentPartner) {
        io.to(userData.currentPartner).emit('answer', answer);
      }
    });
    
    // Handle WebRTC ICE candidates
    socket.on('ice-candidate', (candidate) => {
      const userData = connectedUsers.get(socket.id);
      if (userData && userData.currentPartner) {
        io.to(userData.currentPartner).emit('ice-candidate', candidate);
      }
    });
    
    // Handle chat messages
    socket.on('chat-message', (message) => {
      const userData = connectedUsers.get(socket.id);
      if (userData && userData.currentPartner) {
        io.to(userData.currentPartner).emit('chat-message', message);
      }
    });
    
    // Handle when users want to find a new match
    socket.on('next-match', () => {
      const userData = connectedUsers.get(socket.id);
      
      if (userData && userData.currentPartner) {
        // Notify partner that user disconnected
        io.to(userData.currentPartner).emit('user-disconnected');
        
        // Update partner's data
        if (connectedUsers.has(userData.currentPartner)) {
          connectedUsers.get(userData.currentPartner).currentPartner = null;
        }
        
        // Update user's data
        userData.currentPartner = null;
      }
    });
    
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Notify partner if exists
      const userData = connectedUsers.get(socket.id);
      if (userData && userData.currentPartner) {
        io.to(userData.currentPartner).emit('user-disconnected');
        
        // Update partner's data
        if (connectedUsers.has(userData.currentPartner)) {
          connectedUsers.get(userData.currentPartner).currentPartner = null;
        }
      }
      
      // Remove user from waiting rooms
      waitingUsers.random = waitingUsers.random.filter(
        user => user.socketId !== socket.id
      );
      
      waitingUsers.interests = waitingUsers.interests.filter(
        user => user.socketId !== socket.id
      );
      
      // Remove user from connected users map
      connectedUsers.delete(socket.id);
    });
  });









// Routes
app.get('/', (req, res) => {
  res.send('OnlyUs API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Waiting room for users looking for matches
const waitingUsers = {
    random: [],
    interests: []
  };
  
  // Map of connected users and their socket IDs
  const connectedUsers = new Map();
  
  // Match users based on interests
  function findInterestMatch(user) {
    const { socketId, interests } = user;
    
    // Check for users with at least one matching interest
    for (let i = 0; i < waitingUsers.interests.length; i++) {
      const waitingUser = waitingUsers.interests[i];
      
      // Skip if it's the same user
      if (waitingUser.socketId === socketId) continue;
      
      // Check for common interests
      const commonInterests = waitingUser.interests.filter(interest => 
        interests.includes(interest)
      );
      
      if (commonInterests.length > 0) {
        // Remove matched user from waiting list
        waitingUsers.interests.splice(i, 1);
        return waitingUser;
      }
    }
    
    return null;
  }
  
  // Match users randomly
  function findRandomMatch(user) {
    const { socketId } = user;
    
    // Find any user that's not self
    for (let i = 0; i < waitingUsers.random.length; i++) {
      const waitingUser = waitingUsers.random[i];
      
      // Skip if it's the same user
      if (waitingUser.socketId === socketId) continue;
      
      // Remove matched user from waiting list
      waitingUsers.random.splice(i, 1);
      return waitingUser;
    }
    
    return null;
  }