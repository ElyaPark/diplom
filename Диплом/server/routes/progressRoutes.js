const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const auth = require("../middleware/authMiddleware");

router.post("/word", auth, progressController.markWordLearned);
router.post("/lesson", auth, progressController.markLessonCompleted);

module.exports = router;