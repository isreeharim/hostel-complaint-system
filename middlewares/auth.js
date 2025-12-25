module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.session.user) return res.redirect("/");
    next();
  },

  isAdmin: (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin")
      return res.redirect("/");
    next();
  },

  isStudent: (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "student")
      return res.redirect("/");
    next();
  }
};
