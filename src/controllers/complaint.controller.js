const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { complaintService } = require('../services');

const makeComplaint = catchAsync(async (req, res) => {
    if(!req.body.vendingMachine || !req.body.body || !req.body.urgency) {
        res.status(503).send('Missing Information');
    }
    console.log(req.body)
    let createdComplaint = await complaintService.makeComplaint(req.body);
    if(createdComplaint) {
        res.status(200).send(createdComplaint)
    } else {
        res.status(500).send('Internal Server Error');
    }
});

const getComplaints = catchAsync(async(req, res) => {
    const result = await complaintService.getComplaints();
    res.send(result);
})

const patchPhoto = catchAsync(async(req, res) => {
    const result = await complaintService.addPhoto(req.params.id, req.body.photo);
    res.send(result);
})

const getComplaintByID = catchAsync(async(req, res) => {
    const result = await complaintService.getComplaintByID(req.params.id);
    res.send(result);
})

const getComplaintByMachine = catchAsync(async(req, res) => {
    console.log('jdsfskdfds');
    const result = await complaintService.getComplaintByMachine(req.params.id);
    res.send(result);
})

const updateComplaintByID = catchAsync(async(req, res) => {
    console.log(`checking req` + req.body.newStatus)
    const complaint = await complaintService.updateComplaintByID(req.body.id, req.body.newStatus);
    res.send(complaint);
})

module.exports = {
    makeComplaint,
    getComplaints,
    getComplaintByID,
    getComplaintByMachine,
    updateComplaintByID,
    patchPhoto
};  