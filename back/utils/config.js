require('dotenv').config();

const PORT = {
  http: process.env.HTTP,
  https: process.env.HTTPS
};

const DB_URI = process.env.DB_URI;
const DEV = (process.env.NODE_ENV === "development");
const ENV = process.env.NODE_ENV;

const SECRET = process.env.SECRET;

const CERTIFICATE = {
  KEY: process.env.KEY,
  CERT: process.env.CERT,
  CHAIN: process.env.CHAIN,
};

const EMAIL = {
  username: process.env.EMAIL_USERNAME,
  email: process.env.EMAIL_EMAIL,
  password: process.env.EMAIL_PASSWORD
}

const RECORDINGS_DIR = process.env.RECORDINGS_DIR

module.exports = {
  ENV,
  DEV,
  DB_URI,
  PORT,
  SECRET,
  CERTIFICATE,
  EMAIL,
  RECORDINGS_DIR
};