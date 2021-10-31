const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth-controller");


router.post("/login", AuthController.login);
router.post("/register", AuthController.registerCenter);
router.post("/registerpharmacy", AuthController.registerPharmacy);


module.exports = router;
