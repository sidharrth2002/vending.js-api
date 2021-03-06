const express = require('express');
const validate = require('../../middlewares/validate');
const complaintController = require('../../controllers/complaint.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
.route('/')
.get(auth('getComplaints'), complaintController.getComplaints)
.post(complaintController.makeComplaint);

router
.route('/:id')
.get(complaintController.getComplaintByID)
.post(complaintController.updateComplaintByID)

router
.route('/machine/:id')
.get(auth('getComplaints'), complaintController.getComplaintByMachine)

module.exports = router;
// router.post()

// router.patch()

// router.delete()