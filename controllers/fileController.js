const expressHandler = require("express-async-handler");
const fileModel = require("../models/fileModel");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { createLogger, transports, format } = require("winston");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    removeFile();
    cb(null, "uploadFile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const removeFile = (req, res) => {
  const folderPath = path.join(process.cwd(), "uploadFile");
  fs.readdir(folderPath, (error, files) => {
    if (error) {
      console.log("error reading folder:- ", error);
      return;
    }
    if (files.length === 0) {
      console.log("No files in the folder.");
      return;
    }
    const firstFile = files[0];
    const filePath = path.join(folderPath, firstFile);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.log(error);
    }
  });
};
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

const pdfContent = (req, res) => {
  const folderPath = path.join(process.cwd(), "uploadFile");
  fs.readdir(folderPath, (error, files) => {
    if (error) {
      console.log("error reading folder:- ", error);
      return;
    }
    if (files.length === 0) {
      console.log("No files in the folder.");
      return;
    }
    const firstFile = files[0];
    const filePath = path.join(folderPath, firstFile);
    read(filePath);
  });
  const read = async (filePath) => {
    try {
      let pdfExtract = await pdfParse(filePath);
      pdfContentSerach(pdfExtract.text, req.query.name);
    } catch (error) {
      console.log(error);
    }
  };
};

const pdfContentSerach = (data, searchWord) => {
  let searchData = searchWord;
  const regex = new RegExp(`\\b${searchData.toLowerCase()}\\b`, "g");
  const matches = data.toLowerCase().match(regex);
  // console.log(matches);
  let count = matches ? matches.length : 0;
  if (count === 0) {
    // return console.log("word not found");
    customerLogger.log("info", `Word not found .`);
  } else {
    // console.log(`In a pdf ${searchData} is ${count} time. ${Date.now()}`);
    customerLogger.log("info", `In a pdf ${searchData} is ${count} time.`);
  }
};

const customerLogger = createLogger({
  transports: [
    new transports.File({
      // filename: "file.log",
      filename: "file.txt",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { postFile, upload, pdfContent };
