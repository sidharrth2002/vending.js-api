const httpStatus = require('http-status');
const { Complaint } = require('../models');
const ApiError = require('../utils/ApiError');

const makeComplaint = async(reqbody) => {
    let complaintbody = reqbody.body;
    const newComplaint = new Complaint({
        body: complaintbody
    })
    await newComplaint.save();
    return newComplaint;
}

const getComplaints = async(reqbody) => {
    return Complaint.find({});
}

const getComplaintByID = async(id) => {
    return Complaint.findById(id);
}

const getComplaintByMachine = async(machineID) => {
    return Complaint.findOne( { vendingMachine: machineID } );
}

const updateComplaintByID = async(id, newstatus) => {
    const complaint = await getComplaintByID(id);
    if(!complaint) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Complaint not found');
    }
    complaint.status = newstatus;
    await complaint.save();
}

module.exports = {
    makeComplaint,
    getComplaints,
    getComplaintByID,
    getComplaintByMachine,
    updateComplaintByID
};