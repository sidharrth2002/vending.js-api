const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { Appointment } = require('../models');
const ApiError = require('../utils/ApiError');

const getAppointment =  async() => {
    return Appointment.find({})    
}

const getAppointmentByUserId = async(id) => {
    if(mongoose.isValidObjectId(id)){
        console.log(id);
        return Appointment.find({ technician: mongoose.Types.ObjectId(id) })
    }else{
        return;
    }
}

//integrate later lah
const makeAppointment = async(vendingMachineID, technicianID, serviceType, remarks) => {
    let newAppointment = new Appointment({
        technician: mongoose.Types.ObjectId(technicianID),
        vendingMachine: mongoose.Types.ObjectId(vendingMachineID),
        serviceType: serviceType,
        remarks: remarks,
        deadline: new Date(Date.now() - 86400 * 1000)
    })
    await newAppointment.save();
    return newAppointment;
}

module.exports = {
    getAppointment,
    getAppointmentByUserId,
    makeAppointment
}