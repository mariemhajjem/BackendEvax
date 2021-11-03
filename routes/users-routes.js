const express = require("express");
const router = express.Router();

const userController = require("../controllers/users-controller");
const verifyToken = require("../controllers/verify-token");

router.get("/", userController.getUsers);
router.get("/:cin", userController.getUserByCin);

router.use(verifyToken);

router.post("/", userController.addUser);
router.patch("/:cin", userController.updateUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
