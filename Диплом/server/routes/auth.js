const express = require("express");
const router = express.Router();
const { register, login, logout, check } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/check", auth, check);

module.exports = router;