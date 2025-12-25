const express = require("express");
const Complaint = require("../models/Complaint");
const { isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/dashboard", isAdmin, async (req, res) => {
  const complaints = await Complaint.find().populate("studentId");
  res.render("admin/dashboard", { complaints });
});

router.post("/status/:id", isAdmin, async (req, res) => {
  await Complaint.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.redirect("/admin/dashboard");
});

module.exports = router;
