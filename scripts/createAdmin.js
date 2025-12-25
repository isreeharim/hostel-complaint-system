require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Hostel Admin",
    email: "admin@hostel.com",
    password: hashed,
    role: "admin"
  });

  console.log("Admin created");
  process.exit();
})();
