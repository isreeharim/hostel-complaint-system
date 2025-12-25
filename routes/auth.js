const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("auth/login");
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
    role: "student"
  });
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.redirect("/");

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.redirect("/");

  req.session.user = user;

  user.role === "admin"
    ? res.redirect("/admin/dashboard")
    : res.redirect("/student/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
  