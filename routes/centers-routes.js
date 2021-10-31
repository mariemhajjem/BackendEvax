const express = require("express");
const router = express.Router();
const CenterController = require("../controllers/center-controller");

router.get("/all", CenterController.getCenters); 
router.post("/add", CenterController.addCenter); 
router.get("/:idcenter", CenterController.getCenterById);
//router.delete("/delete/:idcenter", CenterController.deleteCenter);
router.delete("/delete/:name", CenterController.deleteCenter);
router.get("/name/:name", CenterController.getCenterByName);
router.put("/update", CenterController.updateCenter);

router.post("/deposit/:name", CenterController.deposit);
router.post("/:numcenter/withdraw", CenterController.withdraw); 

module.exports = router;