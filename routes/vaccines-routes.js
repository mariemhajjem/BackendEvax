const express = require("express");
const router = express();
const VaccinesController = require("../controllers/vaccines-controller");

router.get("/", VaccinesController.getVaccines); 

router.post("/", VaccinesController.addVaccine);
router.put("/:id", VaccinesController.updateVaccine);

router.delete("/:id", VaccinesController.deleteVaccine);

module.exports = router;

