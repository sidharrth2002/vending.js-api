const mongoose = require('mongoose');
const validator = require('validator');
const { roles } = require('../config/roles');

const appointmentSchema = new mongoose.Schema({
    technician: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    vendingMachine: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'vendingmachine'
    },
    serviceType: {
        type: String,
        enum: ['Repair', 'Refuelling', 'Maintenance', 'General']
    },
    remarks: String,
    deadline: Date,
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Ongoing', 'Completed']
    }
}, {
    timestamps: true
})

const Appointment = mongoose.model('Appointments', appointmentSchema);

module.exports = Appointment;