var express = require("express");
var router = express.Router();
const postController = require("../controllers/post.controller");

/* GET users listing. */
router.get("/", postController.index);
router.get("/:id", postController.detail);
router.put("/:id", postController.updatePost);
router.post("/", postController.create);
router.delete("/:id", postController.deletePost);

module.exports = router;
