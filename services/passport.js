const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Searching for user with googleId: ' + profile.id);
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          console.log('Existing user found');
          done(() => {
            console.log('error in done() for user found');
          }, existingUser);
        } else {
          console.log('No user found user found');
          new User({ googleId: profile.id }).save().then(
            user =>
              done(() => {
                console.log('error in done() for user save');
              }),
            user
          );
        }
      });
    }
  )
);
