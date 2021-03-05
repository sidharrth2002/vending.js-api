const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { Appointment } = require('../models');
const ApiError = require('../utils/ApiError');

const getAppointment =  async() => {
    const appointments = await Appointment.find()
    .populate('technician')
    .populate('vendingMachine')
    return appointments;
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

    if(!mongoose.isValidObjectId(technicianID)){

        technicianID = mongoose.Types.ObjectId(technicianID)

    }

    let newAppointment = new Appointment({
    
        technician: technicianID,
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