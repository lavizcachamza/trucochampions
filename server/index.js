require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // TODO: Restrict in production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const teamsRouter = require('./routes/teams');
const { router: adminRouter } = require('./routes/admin');
const roundsRouter = require('./routes/rounds');
const matchesRouter = require('./routes/matches')(io);
const eventsRouter = require('./routes/events');

app.use('/api/teams', teamsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/rounds', roundsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/events', eventsRouter);

app.get('/', (req, res) => {
  res.send('La Vizcacha API is running 🟢');
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
