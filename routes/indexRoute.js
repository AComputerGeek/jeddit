// @author: Amir Armion
// @version: V.01

const express  = require("express");
const router   = express.Router();
const database = require("../fake-db");
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

// Dashboard Rout:
// URL: "localhost:8000/dashboard"
// The only person can see this page (dashboard page) is the person who is logged in.
// 
// NOTE: For protecting a page from an invalid user, 
// we should use ensureAuthenticated function to check user's authorization.
// NOTE: Anytime if we want to protect a page, we have to use ensureAuthenticated function.
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { dataUser: req.user });
});

router.get("/announcement", ensureAuthenticated, (req, res) => {
  res.render("announcement", {  dataUser: req.user });
});

module.exports = router;
