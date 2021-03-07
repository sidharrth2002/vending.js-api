const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { appointmentService, vendingMachineService, complaintService } = require('../services');
const { bestPossibleTechnician } = require('./shortestPath');
const { Complaint } = require('../models');

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
    // console.log(req.body)
    let bestTechnician;
    let vendingMachine = await vendingMachineService.getVendingMachineByID(req.body.vendingMachineID);
    console.log(vendingMachine)
    if(!vendingMachine) {
        res.status(404).send('Machine Not Found');
    } else {
        let coords = {
            'latitude': vendingMachine.location.latitude,
            'longitude': vendingMachine.location.longitude
        }
        if(req.body.technicianExclude) {
            bestTechnician = await bestPossibleTechnician(coords, technicianExclude);            
        } else {
            bestTechnician = await bestPossibleTechnician(coords, '');
        }
        let complaint = await Complaint.findById(req.body.complaintId);
        console.log(complaint);
        if(!complaint){
            res.status(404).send('Complaint Not Found');
        } else {
            console.log("Final Complaint Body here")
            console.log(complaint.body)
            let complaintAsRemarks = complaint.body;
            let serviceType = req.body.serviceType;
            const result = await appointmentService.makeAppointment(req.body.vendingMachineID, bestTechnician, serviceType, complaintAsRemarks, complaint._id);          
            if(!result){
            }else{
                complaint.status = "WIP"
                await complaint.save();
                res.send(result);
            } 
        }
    }
})

const updateAppointment = catchAsync(async(req, res) => {
    let updated = await appointmentService.updateAppointment(req.params.id, req.body.newStatus);
    if(updated) {
        res.status(200).send(updated);
    } else {
        res.status(500).send('Internal Server Error');
    }
})

const takeOverAppointment = catchAsync(async(req, res) => {
    let newTechnicianID = req.body.technicianID;
    let appointmentID = req.body.appointmentID;
    let updated = await appointmentService.reassignAppointment(appointmentID, newTechnicianID);
    res.send(updated);
})

const deleteAppointment = catchAsync(async(req, res) => {

    /* let vendingMachineID = req.body.vendingMachineID;
    let technicainExclude = req.body.technicianExclude;
    let complaintId = req.body.complaintId; */
    let appointmentID = req.body.appointmentID;
    let deleted = await appointmentService.declineAppointment(appointmentID)

    res.send(deleted)

})

module.exports = {
    getAppointment,
    getAppointmentByUserId,
    makeAppointmentAutomatically,
    updateAppointment,
    takeOverAppointment,
    deleteAppointment
}