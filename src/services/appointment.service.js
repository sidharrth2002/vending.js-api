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
        const appointments = await Appointment.find({ technician: mongoose.Types.ObjectId(id) })
        .populate('technician')
        .populate('vendingMachine');
        return appointments;
    } else {
        return;
    }
}

const getPendingByUserId = async(id) => {
    if(mongoose.isValidObjectId(id)) {
        return Appointment.find({ technician: mongoose.Types.ObjectId, 'status': { $in: ['Pending', 'Ongoing'] } })
    } else {
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

const updateAppointment = async(id, status) => {
    let updated = await Appointment.findOneAndUpdate({_id: id}, {status: status}, {
        new: true
    }).populate('technician').populate('vendingMachine')
    return updated;
}

module.exports = {
    getAppointment,
    getAppointmentByUserId,
    makeAppointment,
    updateAppointment,
    getPendingByUserId
}