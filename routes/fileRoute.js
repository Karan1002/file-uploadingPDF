const express = require("express");
const router = express.Router();
const {
  postFile,
  upload,
  pdfContent,
} = require("../controllers/fileController");

router.get("/", (req, res) => {
  res.send("welcome");
});
router.post("/upload", upload.single("file"), postFile);
router.post("/upload/text", pdfContent);

module.exports = router;
