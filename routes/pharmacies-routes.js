const express = require("express");
 //const router = express.Router();
 const router = express() ;
const PharmacyController = require("../controllers/pharmacy-controller");

router.get("/all", PharmacyController.getPharmacies); 
router.post("/add", PharmacyController.addPharmacy); 
router.get("/:pharmacyId", PharmacyController.getPharmacyById);
//router.delete("/delete/:idpharmacy", PharmacyController.deletePharmacy);
router.delete("/delete/:name", PharmacyController.deleteByNamePharmacy);
router.put("/update", PharmacyController.updatePharmacy);
router.put("/addDispo", PharmacyController.addDisponibilities);
router.get("/name/:name", PharmacyController.getPharmacyByName);

// router.post("/:numpharmacy/deposit", PharmacyController.deposit);
// router.post("/:numpharmacy/withdraw", PharmacyController.withdraw); 

module.exports = router;