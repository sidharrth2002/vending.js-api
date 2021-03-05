const httpStatus = require('http-status');
const { VendingMachine } = require('../models');
const catchAsync = require('../utils/catchAsync');
// const VendingMachine = require('../models/VendingMachine.model');
const ApiError = require('../utils/ApiError');

const getVendingMachine = async(reqbody) => {
    return VendingMachine.find({});
}

const createVendingMachine = catchAsync(async(vendingMachineBody) => {
    let newVendingMachine = new VendingMachine({
        type: vendingMachineBody.type,
        location: {
            address: newVendingMachine.address,
            latitude: newVendingMachine.latitude,
            longitude: newVendingMachine.longitude
        },
        supply: {
            coffee: {
                cappucino: newVendingMachine.cappucino,
                mocha: newVendingMachine.mocha,
                latte: newVendingMachine.latto,
                espresso: newVendingMachine.espresso
            },
            milk: newVendingMachine.milk,
            milo: newVendingMachine.milo,
            snickers: newVendingMachine.snickers           
        }
    });
      
      await newVendingMachine.save();
      return newVendingMachine;
})

const getVendingMachineByID = async(id) => {
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
    createVendingMachine,
    getVendingMachineByID,
    updateVendingMachineByID
};