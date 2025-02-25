import express from 'express'
import cors from 'cors'
import multer from 'multer';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { errorHandlerMiddleware } from './app/middleware/error-handler';
import notFoundMiddleware from './app/middleware/not-found';
import logRequest from './app/middleware/logRequest';
import fs from "fs"
import api from './app/routes';

import "dotenv"

const connectDb = require('./config/db/connect')
const app = express()
const upload = multer();
const logFile = fs.createWriteStream('./express.log', { flags: 'a' });

const corsOptions = {
  origin: '*',  //Your Client, do not write '*'
  credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(upload.array("image"));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(morgan('combined', { stream: logFile }))
app.use(morgan('dev'))

app.use('/api/v2', logRequest, api);
app.use("/uploads", express.static('uploads'))

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 8030
// app.use('/api/v2/accounts', accounts);
// app.use('/api/v2/game', game);
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, console.log(`-----------Listen in port ${port}-----------`));
  } catch (error) {
    console.log(`Error: ${error}`)
  }
}

start();