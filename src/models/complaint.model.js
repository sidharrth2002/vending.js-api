const mongoose = require('mongoose');
const validator = require('validator');
const { roles } = require('../config/roles');

const complaintSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    vendingMachine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vendingmachine'
    },
    urgency: {
      type: String,
      enum : ['Normal', 'Critical', 'Very Critical'],
      default: 'Normal'
    },
    status: {
      type: String,
      default: 'Unsolved',
      enum: ['Solved', 'Unsolved', 'WIP']
    },
    serviceType: {
      type: String,
      enum: ['Repair', 'Refuelling', 'Maintenance', 'General']
    },
    photo: String,
    photoTags: [{
      _id: false,
      confidence: Number,
      tag: String
    }],
    itemsToRefill: [String],
    remarks: String
  }, {
    timestamps: true
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;