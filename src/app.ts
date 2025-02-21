// Sets up the Express server, middleware, routes, and error handling.

import express from 'express';
import { createConnection } from './config/db';
import { baseRouter } from './routes/base.routes';

// Initialize express
export const app = express();

//Connectar a la BBDD
await createConnection();

app.get('/ping', (req, res) => res.send('pong'));

app.use('/api/v1', baseRouter);
