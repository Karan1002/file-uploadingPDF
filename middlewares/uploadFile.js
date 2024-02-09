const multer = require("multer");

const storage = multer.diskStorage({
  diskStorage: (req, file, cb) => {
    cb(null, "uploadFile");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "_" + Date.now());
  },
});

const upload = multer({ storage: storage });
module.exports = { upload };
