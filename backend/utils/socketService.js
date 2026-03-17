let io;

module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
      cors: {
        origin: "*", // Adjust this for production
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
      });

      socket.on('send_message', (data) => {
        const { orderId, message } = data;
        // Broadcast to everyone in the order room except the sender
        socket.to(`order_${orderId}`).emit('receive_message', message);
      });
 
      socket.on('update_location', (data) => {
        const { orderId, location } = data;
        // Broadcast location to everyone in the order room (customer)
        socket.to(`order_${orderId}`).emit('location_update', location);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
  // Helper to emit events to specific rooms
  emitToRoom: (room, event, data) => {
    if (io) {
      io.to(room).emit(event, data);
    }
  },
  // Helper to emit to roles (e.g., all riders)
  emitToRole: (role, event, data) => {
    if (io) {
      io.to(role).emit(event, data);
    }
  }
};
