const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const complaintRoute = require('./complaint.route');
const appointmentRoute = require('./appointment.route');
const vendingMachineRoute = require('./vendingMachines.route');
const shortestPathRoute = require('./shortestPath.route');
const pushnotRoute = require('./pushnot.route');
const coordinatesRoute = require('./coordinates.route');
const mapRoute = require('./map.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/complaint',
    route: complaintRoute
  },
  {
    path: '/appointment',
    route: appointmentRoute
  },
  {
    path: '/vendingmachines',
    route: vendingMachineRoute
  },
  {
    path: '/coordinates',
    route: coordinatesRoute
  },
  {
    path: '/map',
    route: mapRoute
  },
  {
    path: '/testpush',
    route: pushnotRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/shortestpath',
    route: shortestPathRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
