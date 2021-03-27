const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require('express-validator');

const emailService = require("../emails/service");
const { getRegistrationEmail, getResetEmail } = require("../emails/templates");
const { registerValidators, loginValidators } = require('../utils/validators');

const User = require("../models/user");

const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Login",
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", loginValidators, async (req, res) => {
  try {
    const { email } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#login')
    }

    req.session.user = await User.findOne({ email });;
    req.session.isAuthenticated = true;
    // Make the redirect wait until the variables are initialized
    req.session.save((err) => {
      if (err) {
        throw err;
      }

      res.redirect("/");
    });

  } catch (err) {
    console.log(err);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: { items: [] }
    });

    await user.save();
    res.redirect("/auth/login#login");

    await emailService.send(getRegistrationEmail(email))
  } catch (err) {
    console.log(err);
  }
});

router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Forgot password?',
    error: req.flash('error')
  })
});

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong, try again later...')
        return res.redirect('/auth/reset')
      }
      const token = buffer.toString('hex');

      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000; // Expiration time = now + 1h
        await candidate.save();
        await emailService.send(getResetEmail(candidate.email, token));
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'This email does not exist')
        res.redirect('/auth/reset')
      }
    })
  } catch (err) {
    console.log(err)
  }
});

router.get('/password/:token', async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.redirect('/auth/login')
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    })

    if (!user) {
      return res.redirect('/auth/login')
    } else {
      res.render('auth/new-password', {
        title: 'Restore access',
        error: req.flash('error'),
        userId: user._id.toString(),
        token,
      })
    }
  } catch (err) {
    console.log(err)
  }
});

router.post('/password', async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Token expired. Ask for another link')
      res.redirect('/auth/login');
    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
