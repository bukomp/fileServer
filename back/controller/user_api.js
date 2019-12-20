const user = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//const config = require('../utils/config');

//const verification = require('../utils/middleware').verification;
const requestVerification = require('../utils/middleware').requestVerification;
const getToken = require('../utils/middleware').getToken;

const User = require('../models/user');

user.post('/register', async (req, res, next) => {
  try{
    const verificators = ['username', 'name', 'password', 'email', 'availableSpace'];
    if(!requestVerification(verificators, req, res, true))return;

    const body = req.body;
    const dbCheck = await User.findOne({username: body.username});

    if(body.password === undefined || body.password.length < 5)
      return res.status(400).json({error: "password must be at least 5 characters long"});
    if(body.username.length < 3)
      return res.status(400).json({error: "username must be at least 3 characters long"});
    if(body.name.length < 3)
      return res.status(400).json({error: "username must be at least 1 characters long"});
    if(body.email.length < 3)
      return res.status(400).json({error: "email must be at least 3 characters long"});
    if(body.serviceProvider === undefined)
      return res.status(400).json({error: "Service provider status must be specified"});
    if(dbCheck !== null)
      return res.status(409).json({error: "user with particular username already exists"});

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(body.password, saltRounds);

    const client = new User({
      dateOfRegistration: new Date(),
      username: body.username,
      name: body.name,
      email: {
        address: body.email,
        verified: false
      },
      password: passwordHash,
      spaceAccess: {
        type: Number,
        required: true
      },
    });

    const savedUser = await client.save();


    const token = getToken(savedUser.username, savedUser.id);

    savedUser.token = token;

    console.log(sEmail);
    const transporter = await nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: sEmail.email,
        pass: sEmail.password
      }
    });

    const forToken = {
      id: savedUser.id
    };

    const emailVerificationToken = jwt.sign(forToken, process.env.SECRET);

    const mailOptions = {
      from: sEmail.username,
      to: savedUser.email,
      subject: 'Please confirm your email address',
      text: `To verify your email, please visit: ${req.headers['host']}/verify/${emailVerificationToken}`
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(201).json({user:savedUser, rtc_id: savedUser.rtc_id, token})

  } catch (e) {
    next(e)
  }
});

user.post('/login', async (req, res, next) => {
  try{
    const verificators = ['username', 'password'];
    if(!requestVerification(verificators, req, res, true))return;

    const body = req.body;
    const client = await User.findOne({ username: body.username });
    const passwordCorrect = (client === null)
      ? false
      : await bcryptjs.compare(body.password, client.passwordHash);
    if (!(client && passwordCorrect))
      return res.status(401).json({
        error: 'invalid username or password'
      });

    const token = getToken(client.username, client.id);

    return res.status(200).send({
      token,
      rtc_id: client.rtc_id,
      serviceProvider: client.serviceProvider
    })

  } catch (e) {
    next(e)
  }
});


module.exports = user;
