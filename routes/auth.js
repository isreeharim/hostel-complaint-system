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
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      role: "student"
    });
    res.redirect("/");
  } catch (e) {
    res.send("Signup failed");
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.password) return res.send("Invalid login");

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.send("Wrong password");

  req.session.user = user;
  res.redirect(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
