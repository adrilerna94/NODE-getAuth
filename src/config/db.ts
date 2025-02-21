// Handles database connection and configuration.
// This file is responsible for setting up and exporting the database instance.

import mongoose, { type ConnectOptions } from 'mongoose';

export const createConnection = async () => {
  try {
    const options: ConnectOptions = {};

    const dbUrl = process.env.DB_URL ?? '';

    await mongoose.connect(dbUrl, options);
    console.log('INFO Connected to the DB');

    mongoose.connection.on('error', (error) => {
      console.log('ERROR The connection was interrupted: ', error);
    });
  } catch (error) {
    console.log('ERROR Cannot connect to the DB: ', error);
  }
};
