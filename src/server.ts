// Entry point of the application.
// Starts the server and listens for incoming requests.

import { app } from './app';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
