const express = require("express");
const router = express();
const VaccinesController = require("../controllers/vaccines-controller");

router.get("/all", VaccinesController.getVaccines);

router.post("/", VaccinesController.addVaccine);
router.put("/:id", VaccinesController.updateVaccine);

router.delete("/:id", VaccinesController.deleteVaccine);
router.get("/:id", VaccinesController.getVaccineById);
module.exports = router;
