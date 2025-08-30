const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");

function createRoute(req, fieldName) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();
  const directory = path.join(__dirname, "..", "..", "uploads", fieldName, year, month, day);

  req.body.fileUploadPath = path.join("uploads", fieldName, year, month, day);
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file?.originalname) {
      const filePath = createRoute(req, file.fieldname);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: (req, file, cb) => {
    if (file.originalname) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = String(uniqueSuffix + ext);
      req.body.filename = fileName;
      return cb(null, fileName);
    }
    cb(null, null);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedTypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (allowedTypes.includes(ext)) return cb(null, true);
  return cb(createError.BadRequest("Invalid image format"));
}

function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedTypes = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
  if (allowedTypes.includes(ext)) return cb(null, true);
  return cb(createError.BadRequest("Invalid video format"));
}

function videoOrAudioFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedTypes = [
    ".mp4", ".mpg", ".mov", ".avi", ".mkv",
    ".mp3", ".ogg", ".m4a", ".mp2", ".aifc", ".aiff", ".wav"
  ];
  if (allowedTypes.includes(ext)) {
    req.body.fileType = file.mimetype.includes("audio") ? "audio" : "video";
    return cb(null, true);
  }
  return cb(createError.BadRequest("Invalid video or audio format"));
}

function audioFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedTypes = [".mp3", ".ogg", ".m4a"];
  if (allowedTypes.includes(ext)) return cb(null, true);
  return cb(createError.BadRequest("Invalid audio format"));
}

// Maximum file sizes
const avatarMaxSize = 2 * 1000 * 1000; // 2MB
const videoMaxSize = 200 * 1000 * 1000; // 200MB
const audioMaxSize = 20 * 1000 * 1000; // 20MB

const uploadFile = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: avatarMaxSize },
});

const uploadReviewFile = multer({
  storage: storage,
  fileFilter: videoOrAudioFilter,
  limits: { fileSize: videoMaxSize },
});

const uploadAudio = multer({
  storage: storage,
  fileFilter: audioFilter,
  limits: { fileSize: audioMaxSize },
});

module.exports = {
  uploadFile,
  uploadReviewFile,
  uploadAudio,
};
