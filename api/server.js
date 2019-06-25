const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const usersRouter = require('../routers/usersRouter.js');
const savesRouter = require('../routers/savesRouter.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/users', usersRouter)
server.use('/saves', savesRouter)

server.get('/', (req, res) => {
  res.status(200).json({ api: "up" })
})

module.exports = server;