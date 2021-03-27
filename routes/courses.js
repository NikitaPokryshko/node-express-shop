const { Router } = require("express");
const { validationResult } = require('express-validator');
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");
const { courseValidators } = require('../utils/validators');
const router = Router();

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString()
}

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("userId", "email name");

    res.render("courses", {
      title: "All Courses",
      isCourses: true,
      userId: req.user?._id.toString() || null,
      courses,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/edit", authMiddleware, courseValidators, async (req, res) => {
  const { id, ...rest } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // We don't have course, so we can't rely on the fields for sending them to UI
    // TODO: Can be changed with request for Course by id and if exists - send error data for each field
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }

  try {
    const course = await Course.findById(id)

    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }
    Object.assign(course, rest);

    await course.save()

    res.redirect("/courses");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id/edit", authMiddleware, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try {
    const course = await Course.findById(req.params.id);

    if (!isOwner(course, req)) {

      return res.redirect('/courses')
    }

    res.render("course-edit", {
      title: `Edit ${course.title}`,
      course,
    });
  } catch (err) {

  }
});

router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const idToRemove = req.body.id;

    await Course.deleteOne({
      _id: idToRemove,
      userId: req.user._id,
    });

    res.redirect("/courses");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    res.render("course", {
      layout: "empty",
      title: `Course ${course.title}`,
      course,
    });
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
