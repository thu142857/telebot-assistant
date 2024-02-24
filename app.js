const express = require('express');
const cors = require('cors');
const { setupRoutes } = require('./api');
const { apiLogger } = require('./middlewares/api-logger');
const { errorHandler } = require('./middlewares');
const middlewares = require('./middlewares');
const { Telegraf } = require('telegraf');
const handlers = ['errorHandler'];
const subEnvPath = process.env.NODE_ENV !== 'production' ? `.${process.env.NODE_ENV}` : '';
require('dotenv').config({ path: `.env${subEnvPath}` });
const _ = require('lodash');
const { default: axios } = require('axios');
const fs = require('fs');

const app = express();
app.use(cors())
app.use(
  express.json({
    limit: "50mb",
    extended: true
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// middlewares
apiLogger(app);
_.each(Object.keys(middlewares), key => {
  if (!_.includes(handlers, key))
    app.use(middlewares[key]);
});

const router = express.Router();
setupRoutes(router);
app.use('/api', router);

app.get("/api/hello-world", (req, res) => {
  return res.status(200).send('Hello world from API !!!!');
});

// handle error
app.use(errorHandler);

process.on('uncaughtException', error => {
  // should use email service to send email
});

// telegram bot
const pasazibot = new Telegraf(process.env.TELE_BOT);

pasazibot.launch({
  webhook: {
    domain: process.env.HOST,
    path: '/api/v1/tele-bot/hook'
  },
});

app.listen('3001', () => {
  console.log('Server in listening port 3001');
});