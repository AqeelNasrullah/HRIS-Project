const multer = require("multer");
const ErrorHandler = require("../utils/classes/errorHandler");

//setting storage option
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./documents");
  },
  filename: function (req, file, cb) {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.mimetype.split("/")[1];
    const fileName = `${file.fieldname}-${suffix}.${extension}`;
    req.fileName = fileName;
    cb(null, fileName);
  },
});

//upload file
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "application/pdf" ||
      file.mimetype == "application/msword" ||
      file.mimetype == "application/vnd.ms-powerpoint" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype ==
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new ErrorHandler(
          "Only .pdf, .doc, .dox , .pptx and .ppt formats are allowed!",
          400
        )
      );
    }
  },
});

module.exports = upload;
