const mongoose = require('mongoose');
const validator = require('validator');
const { roles } = require('../config/roles');

const vendingMachinesSchema = new mongoose.Schema(
    {
        _id: String,
        type: String,
        location: {
            address: String,
            latitude: Number,
            longitude: Number
        },
        supply: {
            coffee: {
                cappucino: Number,
                mocha: Number,
                latte: Number,
                espresso: Number
            },
            milk: Number,
            milo: Number,
            snickers: Number           
        }
    }, {
        timestamps: true,
    }
);

const VendingMachine = mongoose.model('VendingMachines', vendingMachinesSchema);

module.exports = VendingMachine;