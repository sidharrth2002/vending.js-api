const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { Appointments } = require('../models');
const ApiError = require('../utils/ApiError');

const getAppointment =  async() => {

    //console.log(Appointments.find({}))
    return Appointments.find({})
    
}

const getAppointmentByUserId = async(id) => {

    if(mongoose.isValidObjectId(id)){
        console.log(id);
        return Appointments.find({ technician: mongoose.Types.ObjectId(id) })
    }else{
        return;
    }
    
    //.populate("technician")

}

module.exports = {

    getAppointment,
    getAppointmentByUserId

}