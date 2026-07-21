const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getProfile,
    refresh,
    logout,
    uploadProfileImage,
    createNewPassword
} = require("../controllers/authController");

const {
    protect
} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

router.post("/create-new-password", protect, createNewPassword);

router.get("/profile", protect, getProfile);

router.post("/profile/image", protect, upload.single("image"), uploadProfileImage);

module.exports = router;
