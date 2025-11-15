const express = require('express');
const router = express.Router();
const employeeController = require('../Controller/EmployeeController');

router.get('/getAll', (req, res) => employeeController.getEmployees(req, res));
router.get('/getDetail/:id', (req, res) => employeeController.getEmployee(req, res));
router.post('/create', (req, res) => employeeController.createEmployee(req, res));
router.put('/update/:id', (req, res) => employeeController.updateEmployee(req, res));
router.delete('/delete/:id', (req, res) => employeeController.deleteEmployee(req, res));

module.exports = router;