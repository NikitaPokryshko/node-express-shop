const User = require('../models/user');

// Middleware setting up a current user model to request
module.exports = async function(req, res, next) {
  if (!req.session.user) {
    return next()
  }

  req.user = await User.findById(req.session.user._id);

  next();
}