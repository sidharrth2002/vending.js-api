const httpStatus = require('http-status');
const { Complaint } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const makeComplaint = async(reqbody) => {
    if(!mongoose.isValidObjectId(reqbody.vendingMachineID)) {
        reqbody.vendingMachineID = mongoose.Types.ObjectId(reqbody.vendingMachineID);
    }
    const newComplaint = new Complaint({
        body: reqbody.body,
        urgency: reqbody.urgency,
        serviceType: reqbody.serviceType,
        vendingMachine: mongoose.Types.ObjectId(reqbody.vendingMachineID),
    })
    if(newComplaint.serviceType == 'Refuelling') {
        newComplaint.itemsToRefill = reqbody.itemsToRefill;
    }
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