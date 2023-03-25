// @author: Amir Armion
// @version: V.01

const express  = require("express");
const passport = require("../middleware/passport");
const router   = express.Router();

const { forwardAuthenticated } = require("../middleware/checkAuth");

// URL: "localhost:8000/auth/login"
//
// NOTE: If a user logged in successfully, when that user wants to go back to the login page, 
// forwardAuthenticated prevents this action from that user (a valid and logged in user can not see the login page, unless user logged out).
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

// Step 2:
// URL: "localhost:8000/auth/login"
// When we click the "Login" button in the login page, 
// and username and password were valid, then we are going to go step 3 and 4.
//
// NOTE: "passport.authenticate" sends email(username) and password to the Strategy (passport.js file)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login"
  })
);

// URL: "localhost:8000/auth/logout"
// When "Logout" link clicked in the dashboard page, this code will execute.
router.get("/logout", (req, res) => {
  
  // Destroying the session, so user no longer be authorized
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
