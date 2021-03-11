const express = require('express');
const validate = require('../../middlewares/validate');
const complaintController = require('../../controllers/complaint.controller');
const auth = require('../../middlewares/auth');
const { route } = require('./auth.route');

const router = express.Router();

router
.route('/')
.get(auth('getComplaints'), complaintController.getComplaints)
.post(complaintController.makeComplaint);

router
.route('/addphoto/:id')
.post(complaintController.patchPhoto)

router
.route('/machine/:id')
.get(auth('getComplaints'), complaintController.getComplaintByMachine)

router
.route('/:id')
.get(complaintController.getComplaintByID)
.post(complaintController.updateComplaintByID)


module.exports = router;
// router.post()

// router.patch()

// router.delete()