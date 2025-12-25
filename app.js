require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET || "hostel-secret",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/", require("./routes/auth"));
app.use("/student", require("./routes/student"));
app.use("/admin", require("./routes/admin"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
