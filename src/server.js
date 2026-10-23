import app from './app.js';
import config from './config/env.js';
import connectDB, { disconnectDB } from './config/db.js';
import dns from "node:dns/promises";

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);


const server = app.listen(config.port, () => {
  console.log(
    `Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`
  );
});


const startServer = async () => {
  // Connect to the database BEFORE accepting HTTP traffic
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(
      `Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`
    );
  });

  // Graceful shutdown: stop accepting connections, let in-flight requests
  // finish, close the DB connection, then exit.
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down...`);
    server.close(async () => {
      await disconnectDB();
      console.log('Shutdown complete');
      process.exit(0);
    });
  };


  // A promise rejected somewhere without a .catch(): log it and shut down 
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    shutdown('unhandledRejection');
  });
};

startServer();