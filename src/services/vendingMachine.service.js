const httpStatus = require('http-status');
const { VendingMachine } = require('../models');
// const VendingMachine = require('../models/VendingMachine.model');
const ApiError = require('../utils/ApiError');

const getVendingMachine = async(reqbody) => {
    return VendingMachine.find({});
}

const getVendingMachineByID = async(id) => {
    
    let result = await VendingMachine.findById(id);
    console.log(result)
    return VendingMachine.findById(id);
}

const updateVendingMachineByID = async(id, newSupply) => {
    // Assuming that this function is only able to change the supply counts of each vending machine
    const vendingMachine = await getVendingMachineByID(id);
    if(!vendingMachine) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Vending Machine not found');
    }
    vendingMachine.supply = newSupply;
    await vendingMachine.save();
}

module.exports = {
    getVendingMachine,
    getVendingMachineByID,
    updateVendingMachineByID
};