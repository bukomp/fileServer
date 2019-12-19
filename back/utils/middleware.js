const config = require('./config');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  console.log(
    '\nMethod: '+req.method
    +'\nPath:   '+req.path+
    '\nBody:   '+ JSON.stringify(req.body)+
    '\n---'
  );
  next()
};

const requestVerification = (verificators ,req, res, allTrue) => {
  if(allTrue){
    const hasKeys = verificators.every(item =>
      req.body.hasOwnProperty(item)
    );
    if(!hasKeys){
      res.status(400).json({error: `Request must contain: ${verificators}`});
      return false
    }
    return true;
  } else {
    for(let key in req.body) {
      const hasKeys = verificators.some(verificator => verificator === key);
      if(!hasKeys){
        res.status(400).json({error: `Sent object contains illegal property: ${key}. Legal properties are: ${verificators}`});
        return false
      }
    }
    return true
  }
};

const getToken = (username, id) => {

  const date = new Date();
  date.setHours(date.getHours()+3);

  const forToken = {
    username,
    id,
    exp: date.getTime()
  };

  console.log(`${username} just got token containing: ${JSON.stringify(forToken)}`);

  return jwt.sign(forToken, process.env.SECRET);
};

const verification = async (req, res) => {
  const token = req.headers['x-access-token'];
  let verified = false;

  if (!token) {
    res.status(400).send({ auth: false, error: 'No token provided.' });
    verified = false
  }
  verified = await jwt.verify(token, config.SECRET, async (err, decoded) => {
    if(err){
      res.status(500).send({ auth: false, error: 'Failed to authenticate token.' });
      return false;
    }
    else{
      req.decoded = decoded;

      const checkUser = await Client.find({_id: decoded.id});

      if (decoded.exp < new Date().getTime() || !decoded.exp){
        res.status(401).send({ auth: false, error: 'Token is expired.' });
        return false;
      }
      else if(checkUser.length === 0) {
        res.status(404).json({auth: false, error: "No users with this id found"});
        return false;
      }
      else {
        return true;
      }
    }
  });

  return verified;
};

const errorHandler = (e, req, res, next) => {
  console.error(e.message);

  if (e.name === 'CastError' && e.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id'
    })
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message
    })
  } else if (e.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  } else {
    res.status(500).json(e.message)
  }

  next(e)
};

module.exports = {
  requestLogger,
  errorHandler,
  verification,
  requestVerification,
  getToken
};