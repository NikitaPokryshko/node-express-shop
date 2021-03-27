const multer = require('multer');

const createUniqueFileName = (originalName) => `${new Date().toISOString()}_${originalName}`;

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/png'];

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    callback(null, createUniqueFileName(file.originalname))
  }
});

const fileFilter = (req, file, callback) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

module.exports = multer({ storage, fileFilter })
