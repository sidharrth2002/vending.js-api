const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', 'updateAppointment']);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'getComplaints', 'updateComplaints', 'getVendingMachines', 'getVendingMachineByID', 'updateVendingMachineByID', 'createVendingMachine']);

module.exports = {
  roles,
  roleRights,
};
