
const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const config = require("./utils/config");

const middleware = require("./utils/middleware");
const mainRouter = require("./controller/main");

if(!config.DEV) {
  const trueLog = console.log;

  trueLog("Writing in .log file is *ACTIVE*");

  console.log = (msg) => {
    const date = new Date();
    const dateString = `\n[${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] `;
    msg = dateString + msg;
    fs.appendFile("./log.log", msg, err => {
      if (err) {
        return trueLog(err)
      }
    });
    trueLog(msg)
  };
  trueLog("\nServer is running in development mode:", config.DEV)
}

//Connecting to MongoDB
mongoose.connect(config.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log("meme")
    console.log(`error connection to MongoDB: ${error.message}`)
  });

// Certificate
const credentials = {
  key: (config.DEV)? "" : fs.readFileSync(config.CERTIFICATE.KEY, 'utf-8'),
  cert: (config.DEV)? "" : fs.readFileSync(config.CERTIFICATE.CERT, 'utf-8'),
  ca: (config.DEV)? "" : fs.readFileSync(config.CERTIFICATE.CHAIN, 'utf-8')
};

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());


app.use(middleware.requestLogger);
app.use(middleware.errorHandler);

app.use('/', express.static(__dirname+'/static/build'));

app.use('/', mainRouter);

module.exports = {
  app,
  credentials
};