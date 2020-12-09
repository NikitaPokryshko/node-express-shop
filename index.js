const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');

const app = express();

// Handlebars setup
const hbs = exphbs.create({
  defaultLayout: 'main', // main layout for all the pages (layouts/main.hbs)
  extname: 'hbs', // file extension; by default it's handlebars
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs') 
app.set('views', 'views'); // by default - views, we can declare different name of views folder
// End of Handlebars setup

// Register static folder
app.use(express.static('public')) // to register static folder

// App routes
app.use('/', homeRoutes); // Without prefix - app.use(homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);

/**
 * res.status(200) // by default status: 200 
 * res.sendFile(path.join(__dirname, 'views', 'index.html')) // for default html
 *    vs
 * res.render('index') // for index.handlebars (index.hbs)
 */

// TODO: Initialize with git
// Without router
// app.get('/', (req, res) => {
//   res.render('index', {
//     title: 'Main Page',
//     isHome: true,
//   })
// });

// app.get('/add', (req, res) => {
//   res.render('add', {
//     title: 'Add Course',
//     isAdd: true,
//   })
// });

// app.get('/courses', (req, res) => {
//   res.render('courses', {
//     title: 'All Courses',
//     isCourses: true,
//   })
// });



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});