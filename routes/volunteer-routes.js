const express = require("express");
const router = express.Router();
const VolController = require("../controllers/volunteer-controller");



router.get("/", VolController.getVolunteer);
router.get("/:cin", VolController.getVolByCin);
router.post("/", VolController.addVolunteer);


module.exports = router;