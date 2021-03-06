const httpStatus = require('http-status');
const { Complaint, VendingMachine } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const makeComplaint = async(reqbody) => {
/*     if(mongoose.isValidObjectId(reqbody.vendingMachineID)) {
        reqbody.vendingMachineID = mongoose.Types.ObjectId(reqbody.vendingMachineID);
    } */
    console.log(reqbody)
    let machine = await VendingMachine.findById(reqbody.vendingMachine);

    const newComplaint = new Complaint({
        body: reqbody.body,
        urgency: reqbody.urgency,
        serviceType: reqbody.serviceType,
        vendingMachine: machine._id,
    })
    console.log(`new complaint: ` + newComplaint)
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
    Complaint.findById(id).populate("vendingMachine").exec((err, doc) => {
        console.log(doc)
    });
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