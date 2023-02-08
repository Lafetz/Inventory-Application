const gameController = require("../controllers/gameController");
const express = require("express");
const router = express.Router();
//view
router.get("/", gameController.list);
router.get("/add", gameController.gameAdd_get);
router.post("/add", gameController.gameAdd_post);
router.get("/:id", gameController.gameDetail);
router.get("/:id/update", gameController.gameUpdate_get);
router.post("/:id/update", gameController.gameUpdate_post);
router.get("/:id/delete", gameController.gameRemove);
//add

//update
//router.get("/:id/update", gameController.update);
//router.post("/:id/update", gameController.update);
//delete
//router.get("/:id/delete", gameController.delete);
module.exports = router;
