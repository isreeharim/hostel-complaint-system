const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { isAdmin } = require("../middlewares/auth");

/* ==============================
   ADMIN DASHBOARD
================================ */
router.get("/dashboard", isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId")
      .sort({ createdAt: -1 });

    res.render("admin/dashboard", { complaints });
  } catch (err) {
    console.error(err);
    res.send("Failed to load admin dashboard");
  }
});

/* ==============================
   UPDATE COMPLAINT STATUS
================================ */
router.post("/status/:id", isAdmin, async (req, res) => {
  try {
    const status = req.body.status?.trim();

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.redirect("/admin/dashboard");
    }

    await Complaint.findByIdAndUpdate(req.params.id, { status });

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Failed to update status");
  }
});

/* ==============================
   DELETE COMPLAINT
================================ */
router.post("/delete/:id", isAdmin, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Failed to delete complaint");
  }
});

/* ==============================
   USER MANAGEMENT
================================ */

/* View all users */
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();

    res.render("admin/users", {
      users,
      currentAdminId: req.session.user._id.toString()
    });
  } catch (err) {
    console.error(err);
    res.send("Failed to load users");
  }
});

/* Block / Unblock user */
router.post("/users/block/:id", isAdmin, async (req, res) => {
  try {
    if (req.params.id === req.session.user._id.toString()) {
      return res.redirect("/admin/users");
    }

    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.send("Failed to block/unblock user");
  }
});

/* Promote student → admin */
router.post("/users/promote/:id", isAdmin, async (req, res) => {
  try {
    if (req.params.id === req.session.user._id.toString()) {
      return res.redirect("/admin/users");
    }

    await User.findByIdAndUpdate(req.params.id, {
      role: "admin"
    });

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.send("Failed to promote user");
  }
});

/* Demote admin → student */
router.post("/users/demote/:id", isAdmin, async (req, res) => {
  try {
    if (req.params.id === req.session.user._id.toString()) {
      return res.redirect("/admin/users");
    }

    await User.findByIdAndUpdate(req.params.id, {
      role: "student"
    });

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.send("Failed to demote user");
  }
});

/* Delete user */
router.post("/users/delete/:id", isAdmin, async (req, res) => {
  try {
    if (req.params.id === req.session.user._id.toString()) {
      return res.redirect("/admin/users");
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.send("Failed to delete user");
  }
});

module.exports = router;
