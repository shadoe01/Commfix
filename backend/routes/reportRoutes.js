const express = require("express");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const {
  list, getOne, create, uploadImage, getImage, deleteImage,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", authenticate, list);
router.get("/:id", authenticate, getOne);
router.post("/", authenticate, create);

// Photos. multer (upload.single) runs before uploadImage: it parses the
// multipart form, checks type/size, and saves the file; the controller
// then does the ownership, real-bytes, duplicate, and database checks.
router.post("/:id/images", authenticate, upload.single("image"), uploadImage);
router.get("/:id/images/:imageId", authenticate, getImage);
router.delete("/:id/images/:imageId", authenticate, deleteImage);

// Admin status updates are still later work.
router.put("/:id/status", authenticate, (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet (admin status updates come later)." });
});

module.exports = router;
