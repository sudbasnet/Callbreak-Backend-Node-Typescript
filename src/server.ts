import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import socketIO from 'socket.io';

//Import Middlewares
import errorHandler from './_middlewares/error-handler';
import verifyAuthentication from './_middlewares/authentication-verification';

// Import Routes
import userRoutes from './user/user.routes';
import gameRoutes from './game/game.routes';

// main app
const app = express();

// Environment variables
dotenv.config();

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND as string }));

// Routes
app.use('/user', userRoutes);
app.use('/game', verifyAuthentication, gameRoutes);
app.get('/', (req, res, next) => {
    res.send({ message: 'Default route' });
});

app.use(errorHandler);

// Database Connection
const DB_CONNECTION = process.env.DB_CONNECTION as string;
mongoose.connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(function (reason) {
        console.log('Unable to connect to the mongodb instance. Error: ', reason);
    });

// Server 
// ------
// We could add a logic such that the server starts 
// only if the database connection succeeds
const PORT: number = parseInt(process.env.PORT as string);
const server = app.listen(PORT, () => { console.log("Server is running.") });

// Socket.IO
const io = socketIO(server);
io.on('connection', socket => {
    console.log('Websockets connected.');
});
