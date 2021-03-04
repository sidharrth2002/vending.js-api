const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { appointmentService } = require('../services');

const getAppointment = catchAsync(async(req, res) => {

    const result = await appointmentService.getAppointment();

    res.send(result);

})

const getAppointmentByUserId = catchAsync(async(req, res) => {

    //console.log(req.params.id)
    const result = await appointmentService.getAppointmentByUserId(req.params.id);

    res.send(result);

})

module.exports = {

    getAppointment,
    getAppointmentByUserId

}