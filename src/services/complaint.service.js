const httpStatus = require('http-status');
const { Complaint, VendingMachine } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const makeComplaint = async(reqbody) => {
    //will give url of image in reqbody.photo 

    console.log(reqbody)
    let machine = await VendingMachine.findById(reqbody.vendingMachine);

    const newComplaint = new Complaint({
        body: reqbody.body,
        urgency: reqbody.urgency,
        serviceType: reqbody.serviceType,
        vendingMachine: machine._id,
        // photo: reqbody.photo,
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
    let complaint = Complaint.findById(id).populate("vendingMachine");
    return complaint
}

const getComplaintByMachine = async(machineID) => {
    console.log(machineID);
    return Complaint.findOne( { vendingMachine: machineID } );
}

const updateComplaintByID = async(id, newstatus) => {
    console.log(id, newstatus);
    const complaint = await getComplaintByID(id);
    if(!complaint) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Complaint not found');
    }
    complaint.status = newstatus;
    let result = await complaint.save();
    return result;
}

module.exports = {
    makeComplaint,
    getComplaints,
    getComplaintByID,
    getComplaintByMachine,
    updateComplaintByID
};