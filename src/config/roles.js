const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], []);  // 'getVendingMachines', 'getVendingMachineByID'
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'getComplaints', 'updateComplaints', 'updateVendingMachineByID']);

module.exports = {
  roles,
  roleRights,
};
