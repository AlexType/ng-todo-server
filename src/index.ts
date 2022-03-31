import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import mongoose from 'mongoose';

import router from './routes';

const PORT: number = config.get('serverPort');
const DB_URL: string = config.get('dbUrl');

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

const startServer = (): void => {
  try {
    mongoose.connect(DB_URL);

    app.listen(PORT, (): void => {
      console.log(`Server started on PORT:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
