const express = require('express');
const validate = require('../../middlewares/validate');
const vendingMachineController = require('../../controllers/vendingMachines.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

const checkAuth = (req, res, next) => {
    if(req.body.dummyAuth == 'corneliuspang') {
        next();
    } else {
        res.status(401).send('Someone else is trying to use this API! Screw off!');
    }
}

router
.route('/')
.get(auth('getVendingMachines'), vendingMachineController.getVendingMachine)
.post(auth('createVendingMachine'), vendingMachineController.createVendingMachine)

router
.route('/:id')
.post(checkAuth, vendingMachineController.getVendingMachineByID)
.patch(auth('updateVendingMachineByID'), vendingMachineController.updateVendingMachineByID)



/* router
.route('/machine/:id')
.get(auth('getComplaints'), vendingMachineController.getComplaintByMachine) */

module.exports = router;
// router.post()

// router.patch()

// router.delete()