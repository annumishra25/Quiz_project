import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory state manager
const rooms = new Map();

const generateRoomCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper to broadcast lobby state
const broadcastLobbyUpdate = (roomCode, room) => {
  const pendingList = Array.from(room.pendingPlayers.values());
  const approvedList = Array.from(room.approvedPlayers.values());
  if (room.adminId) {
    io.to(room.adminId).emit('admin-lobby-update', {
      pending: pendingList,
      approved: approvedList
    });
  }
  io.to(roomCode).emit('lobby-update', {
    playersCount: approvedList.length,
    players: approvedList
  });
};

io.on('connection', (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  // Create Lobby (Host)
  socket.on('create-room', (data) => {
    // If admin provides a room code, use it. Otherwise generate one.
    const roomCode = data?.roomCode || generateRoomCode();
    rooms.set(roomCode, {
      adminId: socket.id,
      pendingPlayers: new Map(),
      approvedPlayers: new Map(),
      status: 'waiting',
      currentQuestionIndex: 0,
      answersCount: 0,
    });
    socket.join(roomCode);
    console.log(`[Lobby Created] Room: ${roomCode} by Admin: ${socket.id}`);
    socket.emit('room-created', { roomCode });
  });

  // Admin Join Existing Lobby
  socket.on('admin-join', ({ roomCode }) => {
    if (rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      room.adminId = socket.id;
      socket.join(roomCode);
      console.log(`[Admin Rejoined] Room: ${roomCode}`);
      broadcastLobbyUpdate(roomCode, room);
    } else {
      socket.emit('error', { message: 'Invalid room code' });
    }
  });

  // Request Join (Player)
  socket.on('request-join', ({ roomCode, username, avatar }) => {
    let targetRoomCode = roomCode;
    
    // Auto-join the most recently created room if none specified
    if (!targetRoomCode) {
      const activeRooms = Array.from(rooms.keys());
      if (activeRooms.length > 0) {
        targetRoomCode = activeRooms[activeRooms.length - 1];
      } else {
        socket.emit('error', { message: 'No active rooms available' });
        return;
      }
    }

    if (!rooms.has(targetRoomCode)) {
      socket.emit('error', { message: 'Invalid room code' });
      return;
    }
    
    const room = rooms.get(targetRoomCode);
    
    // Check duplicates
    for (const [id, player] of room.approvedPlayers.entries()) {
      if (player.username === username) {
        socket.emit('error', { message: 'Username already taken in this room' });
        return;
      }
    }
    
    const playerData = { id: socket.id, username, avatar, joinTime: Date.now(), isHost: false };
    room.pendingPlayers.set(socket.id, playerData);
    
    console.log(`[Request Join] ${username} pending in Room: ${targetRoomCode}`);
    
    if (room.adminId) {
      io.to(room.adminId).emit('player-pending', playerData);
      broadcastLobbyUpdate(targetRoomCode, room);
    }
  });

  // Approve Player (Host)
  socket.on('approve-player', ({ roomCode, playerId }) => {
    const room = rooms.get(roomCode);
    if (!room || room.adminId !== socket.id) return;
    
    if (room.pendingPlayers.has(playerId)) {
      const player = room.pendingPlayers.get(playerId);
      room.pendingPlayers.delete(playerId);
      room.approvedPlayers.set(playerId, player);
      
      const playerSocket = io.sockets.sockets.get(playerId);
      if (playerSocket) {
        playerSocket.join(roomCode);
        playerSocket.emit('player-approved', { roomCode });
      }
      
      console.log(`[Approved] Player ${player.username} in Room: ${roomCode}`);
      broadcastLobbyUpdate(roomCode, room);
    }
  });

  // Reject Player (Host)
  socket.on('reject-player', ({ roomCode, playerId }) => {
    const room = rooms.get(roomCode);
    if (!room || room.adminId !== socket.id) return;
    
    if (room.pendingPlayers.has(playerId)) {
      room.pendingPlayers.delete(playerId);
      io.to(playerId).emit('player-rejected');
      console.log(`[Rejected] Player ${playerId} in Room: ${roomCode}`);
      broadcastLobbyUpdate(roomCode, room);
    }
  });

  // Start Quiz (Host)
  socket.on('start-quiz', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.adminId !== socket.id) return;
    
    room.status = 'playing';
    room.currentQuestionIndex = 0;
    room.answersCount = 0;
    
    console.log(`[Quiz Started] Room: ${roomCode}`);
    io.to(roomCode).emit('start-quiz');
  });

  // Submit Answer (Player)
  socket.on('submit-answer', ({ roomCode, answer }) => {
    let targetRoomCode = roomCode;
    
    // Auto-detect room if missing
    if (!targetRoomCode) {
      for (const [code, room] of rooms.entries()) {
        if (room.approvedPlayers.has(socket.id)) {
          targetRoomCode = code;
          break;
        }
      }
    }

    if (!targetRoomCode) return;
    const room = rooms.get(targetRoomCode);
    if (!room) return;
    
    const player = room.approvedPlayers.get(socket.id);
    if (player) {
      player.lastAnswer = answer;
      room.answersCount++;
      
      console.log(`[Answer Submitted] ${player.username} in Room: ${targetRoomCode}`);
      socket.emit('waiting-for-host');
      
      if (room.adminId) {
        io.to(room.adminId).emit('admin-stats-update', {
          answersReceived: room.answersCount,
          totalPlayers: room.approvedPlayers.size
        });
      }
    }
  });

  // Next Question (Host)
  socket.on('next-question', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.adminId !== socket.id) return;
    
    room.currentQuestionIndex++;
    room.answersCount = 0; 
    
    console.log(`[Next Question] Room ${roomCode} advancing to question ${room.currentQuestionIndex}`);
    io.to(roomCode).emit('next-question', {
      currentQuestionIndex: room.currentQuestionIndex,
    });
  });

  // Leaderboard / Statistics triggers
  socket.on('show-leaderboard', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.adminId !== socket.id) return;
    io.to(roomCode).emit('show-leaderboard');
  });

  socket.on('show-statistics', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.adminId !== socket.id) return;
    io.to(roomCode).emit('show-statistics');
  });

  socket.on('spin-wheel', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.adminId !== socket.id) return;
    io.to(roomCode).emit('spin-wheel');
  });

  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] ID: ${socket.id}`);
    for (const [roomCode, room] of rooms.entries()) {
      if (room.approvedPlayers.has(socket.id)) {
        const username = room.approvedPlayers.get(socket.id).username;
        room.approvedPlayers.delete(socket.id);
        console.log(`[Player Left] ${username} left Room: ${roomCode}`);
        broadcastLobbyUpdate(roomCode, room);
      } else if (room.pendingPlayers.has(socket.id)) {
        room.pendingPlayers.delete(socket.id);
        broadcastLobbyUpdate(roomCode, room);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
