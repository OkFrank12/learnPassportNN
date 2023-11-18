import { Request, Response, Router } from "express";
import passport from "passport";

const router: Router = Router();

//auth login
router.get("/login", (req: Request, res: Response) => {
  const user = req.user;
  res.render("login", { user });
});

//auth logout
router.get("/logout", (req: Request, res: Response) => {
  //handle with passport

  req.logout;
  res.redirect("/");
});

// auth with google
// router.get("/google", (req: Request, res: Response) => {
//   //handle with passport
//   res.send("logging in with google");
// });

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// callback route for google to redirect to

export default router;
