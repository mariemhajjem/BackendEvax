const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth-controller");


router.post("/login", AuthController.login);
router.post("/add", AuthController.addUser);

module.exports = router;
