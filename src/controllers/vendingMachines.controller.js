const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { vendingMachineService } = require('../services');

const getVendingMachine = catchAsync(async(req, res) => {
    const result = await vendingMachineService.getVendingMachine();
    res.send(result);
})

const getVendingMachineByID = catchAsync(async(req, res) => {
    const result = await vendingMachineService.getVendingMachineByID(req.params.id);
    res.send(result);
})

const updateVendingMachineByID = catchAsync(async(req, res) => {
    const complaint = await vendingMachineService.updateVendingMachineByID(req.body.id, req.body.newSupply);
    res.send(complaint);
})

module.exports = {
    getVendingMachine,
    getVendingMachineByID,
    updateVendingMachineByID
};  