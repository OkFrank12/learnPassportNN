import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { google } from "./keys";
import userModel from "../models/user-model";

passport.serializeUser(async (user: any, done) => {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  return done(null, user);
});

passport.use(
  new Strategy(
    {
      //options for google strategy
      clientID: google.clientID,
      clientSecret: google.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function

      // console.log(`Passport Callback function fired`);
      // console.log(profile);

      //check if user already exist in our database.
      try {
        userModel.findOne({ googleId: profile.id }).then((currentUser) => {
          console.log(profile._json.picture);
          if (currentUser) {
            //already have a user
            console.log("User is: ", currentUser);
            done(null, currentUser);
          } else {
            //don't have a user
            new userModel({
              username: profile.displayName,
              googleId: profile.id,
              thumbNail: profile._json.picture,
            })
              .save()
              .then((newUser) => {
                console.log("created: ", newUser);
                done(null, newUser);
              });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  )
);
