const { Router } = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();

  res.render('courses', {
    title: 'All Courses',
    isCourses: true,
    courses,
  })
});

router.post('/edit', async (req, res) => {
  const { id, ...rest } = req.body;
  
  await Course.findByIdAndUpdate(req.body.id, { ...rest })

  res.redirect('/courses');
});

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }
  
  const course = await Course.findById(req.params.id);

  res.render('course-edit', {
    title: `Edit ${course.title}`,
    course,
  });
});

router.post('/remove', async (req, res) => {
  try {
    const idToRemove = req.body.id;

    await Course.deleteOne({ _id: idToRemove })

    res.redirect('/courses')
  } catch (err) {
    console.log(err)
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);

  res.render('course', {
    layout: 'empty',
    title: `Course ${course.title}`,
    course,
  });
});

module.exports = router