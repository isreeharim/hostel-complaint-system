const express = require("express");
const Complaint = require("../models/Complaint");
const { isAdmin } = require("../middlewares/auth");

const router = express.Router();

/* Admin Dashboard */
router.get("/dashboard", isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId")
      .sort({ createdAt: -1 });

    res.render("admin/dashboard", { complaints });
  } catch (err) {
    console.error(err);
    res.send("Error loading admin dashboard");
  }
});

/* Update Complaint Status */
router.post("/status/:id", isAdmin, async (req, res) => {
  try {
    const status = req.body.status?.trim();

    console.log("Updating status to:", status); // DEBUG

    await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { runValidators: true }
    );

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Status update failed");
  }
});

/* Admin delete complaint */
router.post("/delete/:id", isAdmin, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Failed to delete complaint");
  }
});


module.exports = router;
