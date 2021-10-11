const express = require("express");
const router = express.Router();
const CenterController = require("../controllers/center-controller");

router.post("/add", CenterController.addCenter); 
router.get("/:idcenter", CenterController.getCenterById);
router.delete("/delete/:idcenter", CenterController.deleteCenter);
//router.get("/name/:numcenter", CenterController.getCenterByName);

router.post("/:numcenter/deposit", CenterController.deposit);
router.post("/:numcenter/withdraw", CenterController.withdraw); 

module.exports = router;