import express, { NextFunction, Request, Response } from "express";
import router from "./routes/authRoutes";
import "./config/passport-setup";
import { connect } from "mongoose";
import { mongodb, mySession } from "./config/keys";
import bodyParser from "body-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import profile from "./routes/profileRoutes";
import path from "path";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//set up view engine
app.set("view engine", "ejs");

// register regenerate & save after the cookieSession middleware initialization
app
  .use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [mySession.cookieKey],
    })
  )
  .use((req: Request, res: Response, next: NextFunction) => {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = (cb: any): any => {
        cb();
      };
    }
    if (req.session && !req.session.save) {
      req.session.save = (cb: any): any => {
        cb();
      };
    }

    next();
  });

// app.use(
//   session({
//     secret: mySession.cookieKey,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 24 * 60 * 60 * 1000, secure: true }, // 1 day
//   })
// );

//set up routes
app.use("/auth", router);
app.use("/profile/", profile);

//initialize passport
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
connect(mongodb.dbUrl).then(() => {
  console.log(`Mongodb is connected`);
});

//create home route
app.get("/", (req: Request, res: Response) => {
  res.render("home", { user: req.user });
});

app.listen(port, () => {
  console.log(`App now listening for requests on port: ${port}`);
});
