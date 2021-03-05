const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { appointmentService, vendingMachineService } = require('../services');
const getShortestPath = require('./shortestPath');

const getAppointment = catchAsync(async(req, res) => {

    const result = await appointmentService.getAppointment();

    res.send(result);

})

const getAppointmentByUserId = catchAsync(async(req, res) => {

    //console.log(req.params.id)
    const result = await appointmentService.getAppointmentByUserId(req.params.id);

    res.send(result);

})

const makeAppointmentAutomatically = catchAsync(async(req, res) => {
    console.log(req.body.vendingMachineID)
    let vendingMachine = await vendingMachineService.getVendingMachineByID(req.body.vendingMachineID);
    if(!vendingMachine) {
        res.status(404).send('Machine Not Found');
    } else {
        console.log(vendingMachine);
        let coords = {
            'latitude': vendingMachine.location.latitude,
            'longitude': vendingMachine.location.longitude
        }
        let bestTechnician = await getShortestPath(coords);

        console.log(bestTechnician)

        let serviceType = "Refueling";
        let remarks = "No Remarks";

        const result = await appointmentService.makeAppointment(req.body.vendingMachineID, bestTechnician, serviceType, remarks);

        res.send(result);
    }
})

module.exports = {

    getAppointment,
    getAppointmentByUserId,
    makeAppointmentAutomatically,

}