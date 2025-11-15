const EmployeeService = require('../Service/EmployeeService');

class EmployeeController {
    // ... (các hàm không thay đổi, giữ nguyên như code gốc của bạn) ...
    async getEmployees(req, res) {
        try {
            const employees = await EmployeeService.getAllEmployees();
            res.json({ status: 'success', data: employees });
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    }

    async getEmployee(req, res) {
        try {
            const employee = await EmployeeService.getEmployeeById(req.params.id);
            res.json({ status: 'success', data: employee });
        } catch (err) {
            res.status(404).json({ status: 'error', message: err.message });
        }
    }

    async createEmployee(req, res) {
        try {
            const employee = await EmployeeService.createEmployee(req.body);
            res.status(201).json({ status: 'success', data: employee });
        } catch (err) {
            res.status(400).json({ status: 'error', message: err.message });
        }
    }

    async updateEmployee(req, res) {
        try {
            const employee = await EmployeeService.updateEmployee(req.params.id, req.body);
            res.json({ status: 'success', data: employee });
        } catch (err) {
            res.status(400).json({ status: 'error', message: err.message });
        }
    }

    async deleteEmployee(req, res) {
        try {
            await EmployeeService.deleteEmployee(req.params.id);
            res.json({ status: 'success', message: 'Xóa nhân viên thành công' });
        } catch (err) {
            res.status(404).json({ status: 'error', message: err.message });
        }
    }
}

module.exports = new EmployeeController();