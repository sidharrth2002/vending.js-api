const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { Appointment, User, VendingMachine } = require('../models');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

const getAppointment = async() => {
    const appointments = await Appointment.find()
    .populate('technician')
    .populate('vendingMachine')
    return appointments;
}

const getAppointmentByUserId = async(id) => {
    if(mongoose.isValidObjectId(id)){
        console.log(id);
        const appointments = await Appointment.find({ technician: id })
        .populate('technician')
        .populate('vendingMachine');
        return appointments;
    } else {
        return;
    }
}

const getPendingByUserId = async(id) => {
    if(mongoose.isValidObjectId(id)) {
        return Appointment.find({ technician: mongoose.Types.ObjectId(id), 'status': { $in: ['Pending', 'Ongoing'] } })
    } else {
        return;
    }
}

//integrate later lah
const makeAppointment = async(vendingMachineID, technicianID, serviceType, remarks) => {
    // console.log(vendingMachineID, remarks)
    if(!mongoose.isValidObjectId(technicianID)){
        technicianID = mongoose.Types.ObjectId(technicianID)
    }
    let technician = await User.findById(technicianID);
    let vendingMachine = await VendingMachine.findById(vendingMachineID);
    let newAppointment = new Appointment({
        technician: technician._id,
        vendingMachine: vendingMachine._id,
        serviceType: serviceType,
        remarks: remarks,
        deadline: moment().add(2,'d').toDate()
    })
    await newAppointment.save();
    return Appointment.findById(newAppointment._id).populate('vendingMachine').populate('technician');
}

const updateAppointment = async(id, status) => {
    console.log(id);
    console.log(status);
    let updated = await Appointment.findByIdAndUpdate(id, {status: status}, {
        new: true,
        useFindAndModify: false
    })
    console.log(updated);
    return updated;
}

const reassignAppointment = async(appointmentID, technicianID) => {
    console.log(appointmentID);
    console.log(technicianID);
    let appointment = await Appointment.findOneAndUpdate({ _id : appointmentID}, 
        {technician: technicianID
    }, {
        new: true
    });
    console.log(appointment);
    return appointment;
}

const declineAppointment = async(appointmentID) => {
    let decline = await Appointment.findOneAndRemove({
        _id: appointmentID
    }, {
        useFindAndModify: false
    })
    console.log(decline)
    return decline
}

module.exports = {
    getAppointment,
    getAppointmentByUserId,
    makeAppointment,
    updateAppointment,
    getPendingByUserId,
    reassignAppointment,
    declineAppointment
}