const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { appointmentService, vendingMachineService, complaintService } = require('../services');
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
    let complaintAsRemarks = "No Remarks Set"
    let vendingMachine = await vendingMachineService.getVendingMachineByID(req.body.vendingMachineID);
    if(!vendingMachine) {
        res.status(404).send('Machine Not Found');
    } else {
        let coords = {
            'latitude': vendingMachine.location.latitude,
            'longitude': vendingMachine.location.longitude
        }
        let bestTechnician = await getShortestPath(coords);
        
        let complaint = await complaintService.getComplaintByID(req.body.complaintId)
        if(!complaint){
            res.status(404).send('Complaint Not Found');
        }else{
            console.log(complaint.remarks)
            let complaintAsRemarks = complaint.remarks;
            let serviceType = req.body.serviceType;
            const result = await appointmentService.makeAppointment(req.body.vendingMachineID, bestTechnician, serviceType, complaintAsRemarks);
            res.send(result);
        }
    }
})

module.exports = {
    getAppointment,
    getAppointmentByUserId,
    makeAppointmentAutomatically
}