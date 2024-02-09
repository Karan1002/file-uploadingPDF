const expressHandler = require("express-async-handler");
const fileModel = require("../models/fileModel");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadFile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const postFile = expressHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.json({ msg: "no file upload" });
    }
    const fileData = fileModel({
      filename: req.file.filename,
      filepath: req.file.path,
    });
    const saveFile = await fileData.save();
    res.json({ saveFile, msg: "sucess upload" });
  } catch (error) {
    res.json({ error });
  }
});

const pdfContent = async (req, res) => {
  const file = "./uploadFile/Karan's Resume.pdf";
  let readFileSync = fs.readFileSync(file);
  try {
    let pdfExtract = await pdfParse(readFileSync);
    pdfContentSerach(pdfExtract.text);
    // console.log("File content: ", pdfExtract.text);
  } catch (error) {
    throw new Error(error);
  }
};

const pdfContentSerach = async (data) => {
  let searchData = "JS";
  const regex = new RegExp(`\\b${searchData.toLowerCase()}\\b`, "g");
  const matches = data.toLowerCase().match(regex);
  let count = matches ? matches.length : 0;
  if (count === 0) {
    return console.log("word not found");
  } else {
    console.log("given word is ", count);
    console.log(`In a pdf ${searchData} is ${count} time. ${Date.now()}`);
    const dirPath = path.join(process.cwd(), "File Log Details");
    console.log(dirPath);
    fs.writeFileSync(
      `${dirPath}/log.txt`,
      `In a pdf ${searchData} is ${count} time. ${Date.now()}` + "\n"
    );
  }
};

module.exports = { postFile, upload, pdfContent };
