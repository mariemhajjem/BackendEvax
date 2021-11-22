const express = require("express");
const router = express.Router();

const userController = require("../controllers/users-controller");
const verifyToken = require("../controllers/verify-token");



// to check  ,  users eli !LOGGEDIN can acces routes adhouma  , 0 restriction 

//exemple to handle acces ---> userController.grantAccess('readAny', 'DB.table'),
router.get("/", userController.grantAccess('readAny', 'Users'), userController.getUsers);
router.get("/:cin", userController.getUserByCin);

//router.use(verifyToken); // why ? 

router.post("/",userController.grantAccess('updateAny', 'Users'), userController.addUser);
router.put("/:cin", userController.updateUser);

router.delete("/:id",userController.grantAccess('deleteAny', 'Users') ,userController.deleteUser);


module.exports = router;
