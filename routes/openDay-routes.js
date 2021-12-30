const express = require("express");
const router = express.Router();
const OpenDayController = require("../controllers/openDay-controller");

router.get("/all", OpenDayController.getOpendays); 
router.post("/add", OpenDayController.addOpenDay); 
router.get("/:idOpenDay", OpenDayController.getOpendaysById);

router.put("/update", OpenDayController.updateOpenDay);


module.exports = router;