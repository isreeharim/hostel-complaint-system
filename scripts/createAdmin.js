require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hash = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@hostel.com",
    password: hash,
    role: "admin"
  });

  console.log("Admin created");
  process.exit();
})();
