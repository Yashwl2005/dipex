const multer = require('multer');

// Configure storage
const storage = multer.diskStorage({
  // Use memoryStorage or diskStorage. 
  // diskStorage saves the file locally before uploading to Cloudinary
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

// Configure file filter (optional, to accept only specific file types)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Please upload only videos or images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // Limit to 100MB
  },
});

module.exports = upload;
