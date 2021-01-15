const { Router } = require("express");
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");

const router = Router();

router.get("/", async (req, res) => {
  const courses = await Course.find()
    .populate("userId", "email name");

  res.render("courses", {
    title: "All Courses",
    isCourses: true,
    courses,
  });
});

router.post("/edit", authMiddleware, async (req, res) => {
  const { id, ...rest } = req.body;

  await Course.findByIdAndUpdate(req.body.id, { ...rest });

  res.redirect("/courses");
});

router.get("/:id/edit", authMiddleware, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  const course = await Course.findById(req.params.id);

  res.render("course-edit", {
    title: `Edit ${course.title}`,
    course,
  });
});

router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const idToRemove = req.body.id;

    await Course.deleteOne({ _id: idToRemove });

    res.redirect("/courses");
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  res.render("course", {
    layout: "empty",
    title: `Course ${course.title}`,
    course,
  });
});

module.exports = router;
