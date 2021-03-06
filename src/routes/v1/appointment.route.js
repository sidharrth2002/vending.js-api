const express = require('express');
const validate = require('../../middlewares/validate');
const appointmentController = require('../../controllers/appointment.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(appointmentController.getAppointment)
    .delete(appointmentController.deleteAppointment);

router
    .route('/autoappointment')
    .post(auth('getUsers'), appointmentController.makeAppointmentAutomatically);

router
    .route('/:id')
    .get(auth('getUsers'), appointmentController.getAppointmentByUserId)
    .patch(auth('getUsers'), appointmentController.updateAppointment)

router
    .route('/takeover')
    .post(auth('getUsers'), appointmentController.takeOverAppointment)

module.exports = router;