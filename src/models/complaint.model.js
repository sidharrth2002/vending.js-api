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
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'VendingMachines'
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
    }
  }, {
    timestamps: true
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;