const main = require('express').Router();

//request template for let's encrypt
main.get('.well-known/acme-challenge/a-string', async (req, res, next) => {
  res.status(200).send("a-challenge")
});

main.get('api/*', async (req, res) => {
  return res.status(404).send()
});

main.get('*', async (req, res) => {
  res.writeHead(301, {"Location": req.protocol + "://" + req.headers['host']});
  return res.end();
});

module.exports = main
