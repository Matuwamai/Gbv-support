import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Never trust the client's filename: keep only a safe, lowercase extension.
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, "");
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

const makeFilter = (allowedPrefixes) => (req, file, cb) => {
  if (allowedPrefixes.some((prefix) => file.mimetype.startsWith(prefix))) {
    return cb(null, true);
  }
  const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);
  error.message = "Unsupported file type";
  return cb(error);
};

// Images or videos attached to posts.
export const uploadMedia = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: makeFilter(["image/", "video/"]),
});

// Profile pictures.
export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: makeFilter(["image/"]),
});

export const toUploadPath = (file) => (file ? `/uploads/${file.filename}` : null);

// Best-effort removal of a previously uploaded file, e.g. when it is replaced.
export const removeUpload = async (relativePath) => {
  if (!relativePath || !relativePath.startsWith("/uploads/")) return;
  const filePath = path.join(UPLOAD_DIR, path.basename(relativePath));
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") console.error("Failed to remove upload:", error);
  }
};
