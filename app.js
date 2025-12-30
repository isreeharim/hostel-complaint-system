require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const serverless = require("serverless-http");

const app = express();

/* Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.set("view engine", "ejs");

/* MongoDB (serverless-safe: connect once) */
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}
connectDB();

/* Routes */
app.use("/", require("./routes/auth"));
app.use("/student", require("./routes/student"));
app.use("/admin", require("./routes/admin"));

/* Export for Vercel */
module.exports = serverless(app);
