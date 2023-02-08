const publisherController = require("../controllers/publisherController");
const express = require("express");
const router = express.Router();
router.get("/", publisherController.list);
router.post("/add", publisherController.publisher_post);
router.get("/add", publisherController.publisher_get);
router.get("/:id", publisherController.main_get);
router.post("/:id", publisherController.main_post);
router.get("/:id/delete", publisherController.main_remove);

module.exports = router;
