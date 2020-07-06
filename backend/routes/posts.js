const express = require("express");
const router = express.Router();

const userController = require("../controller/posts");

const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file');


router.get("" , userController.getPosts);

router.get("/:id" , userController.getPost);

router.post("" ,checkAuth ,extractFile, userController.postDetails);

router.put("/:id", checkAuth ,extractFile, userController.updatePost);

router.delete("/:id" , checkAuth , userController.deletePost);

module.exports = router;

// const { TesseractWorker } = require("tesseract.js");

// const worker = new TesseractWorker();

// const upload = multer({storage : storage}).single("image");

// router.get("/:textId" , getText);

// router.post("/upload" ,checkAuth ,multer({storage:storage}).single("image"), postImage);