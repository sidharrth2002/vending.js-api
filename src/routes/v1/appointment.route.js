const express = require('express');
const validate = require('../../middlewares/validate');
const appointmentController = require('../../controllers/appointment.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(auth('getUsers'), appointmentController.getAppointment);

router
    .route('/autoappointment')
    .post(auth('getUsers'), appointmentController.makeAppointmentAutomatically);

router
    .route('/:id')
    .get(auth('getUsers'), appointmentController.getAppointmentByUserId);

module.exports = router;