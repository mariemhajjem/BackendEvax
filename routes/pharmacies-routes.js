const express = require("express");
 //const router = express.Router();
 const router = express() ;
const PharmacyController = require("../controllers/pharmacy-controller");

router.get("/all", PharmacyController.getPharmacies); 
router.post("/add", PharmacyController.addPharmacy); 
router.get("/:idpharmacy", PharmacyController.getPharmacyById);
router.delete("/delete/:idpharmacy", PharmacyController.deletePharmacy);
//router.get("/name/:numpharmacy", PharmacyController.getPharmacyByName);

// router.post("/:numpharmacy/deposit", PharmacyController.deposit);
// router.post("/:numpharmacy/withdraw", PharmacyController.withdraw); 

module.exports = router;