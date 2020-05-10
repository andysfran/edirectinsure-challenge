//npm modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin:['http://localhost:3000'],
  methods:['GET','POST', 'PUT', 'DELETE'],
  credentials: true // enable set cookie
}));

app.use(session({
    name: process.env.SESS_NAME,
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 31556952000
    }
}));

app.use(require('./controllers'));

app.listen(3001, () => {
  console.log('Listening on port 3001');
});
