const express = require("express");
const multer = require("multer");

const {
  uploadMedia,
  getAllMedias,
} = require("../controllers/media-controller");
const { authenticateRequest } = require("../middleware/auth-middleware");
const logger = require("../utils/logger");

const router = express.Router();

//configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

router.post(
  "/upload",
  authenticateRequest,
  (req, res, next) => {
    console.log("🔹 Incoming file upload request...",req);
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.error("❌ Multer Error:", err);
        return res.status(400).json({
          message: "Multer error while uploading:",
          error: err.message,
          stack: err.stack,
        });
      } else if (err) {
        console.error("❌ Unexpected Error:", err);
        return res.status(500).json({
          message: "Unknown error occured while uploading:",
          error: err.message,
          stack: err.stack,
        });
      }

      if (!req.file) {
        console.error("❌ No file uploaded!");
        return res.status(400).json({
          message: "No file found!",
        });
      }

      next();
    });
  },
  uploadMedia
);
router.get("/all", authenticateRequest, getAllMedias);


module.exports = router;