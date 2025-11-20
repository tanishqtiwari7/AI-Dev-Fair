const express = require("express");
const auth = require("../middleware/Auth");
const {
  getTree,
  getContent,
  searchRepo,
} = require("../controllers/ExplorerController");

const router = express.Router();

router.post("/tree", auth, getTree);
router.post("/content", auth, getContent);
router.post("/search", auth, searchRepo);

module.exports = router;
