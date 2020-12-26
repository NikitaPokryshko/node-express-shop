require("dotenv").config();

const express = require("express");
const path = require("path");

const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const mongoose = require("mongoose");

const homeRoutes = require("./routes/home");
const addRoutes = require("./routes/add");
const coursesRoutes = require("./routes/courses");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");

const User = require("./models/user");

const app = express();

// Handlebars setup
const hbs = exphbs.create({
  // main layout for all the pages (layouts/main.hbs)
  defaultLayout: "main",
  // file extension; by default it's handlebars,
  extname: "hbs",
  // to allow specifying of runtime-options to pass to the template function (handlebars + mongoose)
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views"); // by default - views, we can declare different name of views folder
// End of Handlebars setup

// Temprorary TODO: Delete after
app.use(async (req, res, next) => {
  try {
    const user = await User.findById("5fe2779e0528509cb30f98c9");

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
  }
});

// Register static folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// App routes
app.use("/", homeRoutes); // Without prefix - app.use(homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);

const PORT = process.env.PORT || 3000;

const { DB_PASSWORD, DB_NAME, DB_USER, DB_CLUSTER_URL } = process.env;

const databaseUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_URL}/${DB_NAME}`;

async function start() {
  try {
    console.log("Connecting to MongoDB remote server...");
    await mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    // Temporary data to stub fake single user
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "pokryshko.n@gmail.com",
        name: "Nikitooos",
        cart: { items: [] },
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
