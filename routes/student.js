const express = require("express");
const Complaint = require("../models/Complaint");
const { isStudent } = require("../middlewares/auth");

const router = express.Router();

router.get("/dashboard", isStudent, async (req, res) => {
  const complaints = await Complaint.find({ studentId: req.session.user._id });
  res.render("student/dashboard", { user: req.session.user, complaints });
});

router.post("/complaint", isStudent, async (req, res) => {
  await Complaint.create({
    studentId: req.session.user._id,
    title: req.body.title,
    description: req.body.description
  });
  res.redirect("/student/dashboard");
});

module.exports = router;
