const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.set('view engine', hbs);

// MIDDLEWARE
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});
app.use(express.static(path.join(__dirname, 'public')));

// REGISTERHELPER
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// GET
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home',
    welcomeMessage: 'Welcome To My Page',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Bad Request',
    code: 400,
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
