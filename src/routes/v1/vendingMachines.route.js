const express = require('express');
const validate = require('../../middlewares/validate');
const vendingMachineController = require('../../controllers/vendingMachines.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
.route('/')
.get(auth('getVendingMachines'), vendingMachineController.getVendingMachine)
.post(auth('createVendingMachine'), vendingMachineController.createVendingMachine)

router
.route('/:id')
.get(auth('getVendingMachineByID'), vendingMachineController.getVendingMachineByID)
.patch(auth('updateVendingMachineByID'), vendingMachineController.updateVendingMachineByID)

// router
// .route('/machine/:id')
// .get(auth('getComplaints'), vendingMachineController.getComplaintByMachine)

module.exports = router;
// router.post()

// router.patch()

// router.delete()