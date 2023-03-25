// @author: Amir Armion
// @version: V.01

module.exports = {
  ensureAuthenticated: (req, res, next) => {

    if(req.isAuthenticated()) 
    {
      return next();
    }

    res.redirect("/auth/login");
  },
  forwardAuthenticated: (req, res, next) => {

    if(!req.isAuthenticated()) 
    {
      return next();
    }

    res.redirect("/dashboard");
  }
};
