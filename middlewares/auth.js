exports.isStudent = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "student") {
    return res.redirect("/");
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
};
