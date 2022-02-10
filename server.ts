
// import App from './app';
import http from 'http';
import express from 'express';

const app = express();

const normalizePort = val => {
  const testedPort = parseInt(val, 10);

  if (isNaN(testedPort)) {
    return val;
  }
  if (testedPort >= 0) {
    return testedPort;
  }
  return false;
};

// const app = new App();
// app.setPort();

// Set port to 3000
const port = normalizePort(process.env.PORT || '3000');

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// const server = app.createServer();
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

app.get('/', (request, response) => {
  response.send('Hello');
});

server.listen(port, () => {
  console.log('server running on port '+port);
});