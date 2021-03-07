const express = require('express');
const validate = require('../../middlewares/validate');
const appointmentController = require('../../controllers/appointment.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(appointmentController.getAppointment)
    .post(appointmentController.deleteAppointment);

router
    .route('/autoappointment')
    .post(auth('getUsers'), appointmentController.makeAppointmentAutomatically);
    
router
    .route('/takeover')
    .post(appointmentController.takeOverAppointment)

router
    .route('/:id')
    .get(auth('getUsers'), appointmentController.getAppointmentByUserId)
    .post(auth('getUsers'), appointmentController.updateAppointment)


module.exports = router;