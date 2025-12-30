const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

/* Login Page */
router.get("/", (req, res) => {
  res.render("auth/login");
});

/* Signup Page */
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

/* Signup */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.send("User already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hash,
      role: "student"
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Signup failed");
  }
});

/* Login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send("Invalid email or password");
    }

    // ✅ BLOCK CHECK (CORRECT PLACE)
    if (user.isBlocked) {
      return res.send("Your account is blocked by admin");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send("Invalid email or password");
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      role: user.role
    };

    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/student/dashboard");
    }

  } catch (err) {
    console.error(err);
    res.send("Login failed");
  }
});

/* Logout */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
