const express = require('express');
const dbConnect = require('./dbConnect');
const dotenv = require('dotenv');
const path = require('path');

const cookieParser = require('cookie-parser');
const errorControllers = require('./controllers/errorControllers');
const authControllers = require('./controllers/authControllers');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');
const journeyRoutes = require('./routes/journeyRoutes');


dbConnect();
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

// api routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/journeys', journeyRoutes);


// html routes 
// for users

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
  });

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

app.get('/signup', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'signup.html'));
    });
app.get('/reset-password/:token',authControllers.protect, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resetPassword.html'));
  });


app.get('/forgotPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forgotPassword.html'));
  });

app.get('/updatePassword',authControllers.protect, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'updatePassword.html'));
  });


// for profile 

app.get('/profile/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
  });

  app.get('/profile/:id/newjourney', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newJourney.html'));
  });

  
  
  // for places

  app.get('/city/:city', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'city.html'));
    });


    app.get('/:city/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'placeDetails.html'));
  });

  app.get('/microbus/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'microbus.html'));
  });


// for 404 page
app.get ('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
})


app.use(errorControllers)
module.exports = app