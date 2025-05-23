import express from "express";
import multer from "multer";
import path from "path";
import { isAuth } from "../middlewares/isAuth.js";
import { uploadProfilePic } from "../controllers/uploadProfilePic.js";

const router = express.Router();

// Ensure uploads/profile-pics exists
import fs from "fs";
const uploadDir = path.join(process.cwd(), "server", "uploads", "profile-pics");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + "-" + Date.now() + ext);
  },
});

const upload = multer({ storage });

router.post("/user/profile-pic", isAuth, upload.single("profilePic"), uploadProfilePic);

export default router;
