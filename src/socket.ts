import socketIO from 'socket.io';

let io: socketIO.Server;

export default {
    init: (httpServer: import("http").Server | import("https").Server) => {
        io = socketIO(httpServer);
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('WebSockets not initialized!');
        }
        return io;
    }
}