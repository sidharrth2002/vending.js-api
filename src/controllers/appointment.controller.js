const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { appointmentService, vendingMachineService, complaintService } = require('../services');
const { bestPossibleTechnician } = require('./shortestPath');

const getAppointment = catchAsync(async(req, res) => {
    const result = await appointmentService.getAppointment();
    console.log(result);
    res.send(result);
})

const getAppointmentByUserId = catchAsync(async(req, res) => {
    //console.log(req.params.id)
    const result = await appointmentService.getAppointmentByUserId(req.params.id);
    res.send(result);
})

const makeAppointmentAutomatically = catchAsync(async(req, res) => {
    let vendingMachine = await vendingMachineService.getVendingMachineByID(req.body.vendingMachineID);
    if(!vendingMachine) {
        res.status(404).send('Machine Not Found');
    } else {
        let coords = {
            'latitude': vendingMachine.location.latitude,
            'longitude': vendingMachine.location.longitude
        }
        if(req.body.technicianExclude) {
            let bestTechnician = await bestPossibleTechnician(coords, technicianExclude);            
        } else {
            let bestTechnician = await bestPossibleTechnician(coords, '');
        }
        
        let complaint = await complaintService.getComplaintByID(req.body.complaintId)
        if(!complaint){
            res.status(404).send('Complaint Not Found');
        }else{
            console.log(complaint.body)
            let complaintAsRemarks = complaint.body;
            let serviceType = req.body.serviceType;
            const result = await appointmentService.makeAppointment(req.body.vendingMachineID, bestTechnician, serviceType, complaintAsRemarks);
            res.send(result);
        }
    }
})

const updateAppointment = catchAsync(async(req, res) => {
    let updated = await appointmentService.updateAppointment(req.params.id, req.body.status);
    if(updated) {
        res.status(200).send(updated);
    } else {
        res.status(500).send('Internal Server Error');
    }
})

const takeOverAppointment = catchAsync(async(req, res) => {
    console.log(req)
    let newTechnicianID = req.body.technicianID;
    let appointmentID = req.body.appointmentID;
    let updated = await appointmentService.reassignAppointment(appointmentID, newTechnicianID);
    res.send(updated);
})

module.exports = {
    getAppointment,
    getAppointmentByUserId,
    makeAppointmentAutomatically,
    updateAppointment,
    takeOverAppointment
}