const httpStatus = require('http-status');
const { Complaint, VendingMachine } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const { default: axios } = require('axios');

const makeComplaint = async(reqbody) => {
    console.log(reqbody)
    let machine = await VendingMachine.findById(reqbody.vendingMachine);

    const newComplaint = new Complaint({
        body: reqbody.body,
        urgency: reqbody.urgency,
        serviceType: reqbody.serviceType,
        vendingMachine: machine._id,
    });

    if(reqbody.photo) {
        const apiKey = 'acc_0270a2197e1446a';
        const apiSecret = 'ededc6b384feb1e7fe0666aa2890f09e';
        const imageUrl = reqbody.photo;
        const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);
        console.log(url);
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiSecret
            }
        });
    
        //filter only ones with confidence above 30
        let tags = response.data.result.tags;
        let filtered = tags.filter(tag => tag.confidence > 30);
    
        //restructure
        for(tag of filtered) {
            tag.tag = tag.tag.en;
        }
        console.log(filtered);
        newComplaint.photo = reqbody.photo;
        newComplaint.photoTags = filtered;
    }

    console.log(`new complaint: ` + newComplaint)
    if(newComplaint.serviceType == 'Refuelling') {
        newComplaint.itemsToRefill = reqbody.itemsToRefill;
    }
    await newComplaint.save();
    return newComplaint;
}

const addPhoto = async(id, photo) => {
    let complaint = await Complaint.findById(id);
    const apiKey = 'acc_0270a2197e1446a';
    const apiSecret = 'ededc6b384feb1e7fe0666aa2890f09e';
    const imageUrl = photo;
    const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);
    console.log(url);
    const response = await axios.get(url, {
        auth: {
            username: apiKey,
            password: apiSecret
        }
    });
    //filter only ones with confidence above 30
    let tags = response.data.result.tags;
    let filtered = tags.filter(tag => tag.confidence > 30);

    //restructure
    for(tag of filtered) {
        tag.tag = tag.tag.en;
    }
    console.log(filtered);
    complaint.photo = photo;
    complaint.photoTags = filtered;
    await complaint.save();
    return complaint;
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
    updateComplaintByID,
    addPhoto
};