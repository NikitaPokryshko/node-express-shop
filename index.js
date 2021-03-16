require("dotenv").config();

// Libraries
const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");

// Handlebars
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

// Routes
const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");

// Middlewares
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

const configKeys = require("./keys");

const app = express();

// Handlebars setup
const hbs = exphbs.create({
  // main layout for all the pages (layouts/main.hbs)
  defaultLayout: "main",
  // file extension; by default it's handlebars,
  extname: "hbs",
  // to allow specifying of runtime-options to pass to the template function (handlebars + mongoose)
  handlebars: allowInsecurePrototypeAccess(Handlebars),

  helpers: require('./utils/hbs-helpers')
});

const store = new MongoStore({
  // Collection name for sessions storing
  collection: 'sessions',
  uri: configKeys.MONGO_DB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views"); // by default - views, we can declare different name of views folder
// End of Handlebars setup


// Registering static folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Registering and configuring session
app.use(session({
  secret: configKeys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}))
// CSRF token checking middleware
app.use(csrf())
// Connect-flash middleware for validation
app.use(flash())

// Registering my app middlewares
app.use(varMiddleware)
app.use(userMiddleware)

// Registering app routes
app.use("/", homeRoutes); // Without prefix - app.use(homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);


async function start() {
  try {
    console.log("Connecting to MongoDB remote server...");
    await mongoose.connect(configKeys.MONGO_DB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    app.listen(configKeys.APP_PORT, () => {
      console.log(`Server is running on port ${configKeys.APP_PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
