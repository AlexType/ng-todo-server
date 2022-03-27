import config from 'config';
import express from 'express';
import mongoose from 'mongoose';

import authRouter from './routes/auth.routes.js';

const PORT = config.get('serverPort');
const DB_URL = config.get('dbUrl');

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

const start = () => {
  try {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log('Server start');
    });
  } catch (err) {
    console.log(err);
  }
};

start();
