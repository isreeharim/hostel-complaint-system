const express = require("express");
const Complaint = require("../models/Complaint");
const { isStudent } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const router = express.Router();

/* Student Dashboard */
router.get("/dashboard", isStudent, async (req, res) => {
  const complaints = await Complaint.find({
    studentId: req.session.user._id
  });

  res.render("student/dashboard", {
    user: req.session.user,
    complaints
  });
});

/* Submit Complaint with Cloud Image */
router.post(
  "/complaint",
  isStudent,
  upload.single("image"),
  async (req, res) => {
    try {
      await Complaint.create({
        studentId: req.session.user._id,
        title: req.body.title,
        description: req.body.description,
        // Cloudinary gives secure URL in req.file.path
        image: req.file ? req.file.path : null
      });

      res.redirect("/student/dashboard");
    } catch (err) {
      console.error(err);
      res.send("Error submitting complaint");
    }
  }
);
// DELETE complaint (student)
router.post("/complaint/delete/:id", isStudent, async (req, res) => {
  try {
    await Complaint.deleteOne({
      _id: req.params.id,
      studentId: req.session.user._id
    });

    res.redirect("/student/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Failed to delete complaint");
  }
});


module.exports = router;
