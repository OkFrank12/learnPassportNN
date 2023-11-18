import { NextFunction, Request, Response, Router } from "express";

const profile: Router = Router();

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect("/auth/login");
  } else {
    // if user is logged in
    next();
  }
};

profile.get("/", authCheck, (req: Request | any, res: Response) => {
  const user = req.user;
  return res.render("profile", { username: user.username });
});

export default profile;
