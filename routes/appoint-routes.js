const express = require('express');
const router = express.Router();

const AppointController = require('../controllers/appoint-controller');
const verifyToken = require('../controllers/verify-token');
router.get("/", AppointController.SearchOldPeopleAppoints)
//router.use(verifyToken)

router.post("/add-appoint", AppointController.addAppoint)
router.put("/update-appoint/:id",AppointController.updateAppoint)

module.exports = router;