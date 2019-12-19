const app = require('./app')
const PORT = require('./utils/config').PORT
const config = require('./utils/config')

let server;

if (!config.DEV) {
  server = require('http').createServer((req, res) => {
    res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
    res.end();
  })
} else {
  server = require('http').createServer(app.app);
  const io = require('socket.io')(server);
  require('./utils/io')(io);
}

const secureServer = require('https').createServer(app.credentials, app.app);
const ioS = require('socket.io')(secureServer);
require('./utils/io')(ioS);

server.listen(PORT.http, () => {
  console.log(`Web redirection server running on port: ${PORT.http}`)
});

secureServer.listen(PORT.https, () => {
  console.log(`Web server running on port: ${PORT.https}`)
});