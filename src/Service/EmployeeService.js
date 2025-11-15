const Employee = require('../models/EmployeeModel');

class EmployeeService {
    VALID_ROLES = ['sales_staff', 'kitchen_staff'];

    _calculateMonthlySalary(salaryPerDay) {
        const STANDARD_WORK_DAYS = 22;
        return salaryPerDay * STANDARD_WORK_DAYS;
    }

    async getAllEmployees() {
        const employees = await Employee.find().lean();
        return employees.map(emp => ({
            ...emp,
            monthlySalary: this._calculateMonthlySalary(emp.salaryPerDay)
        }));
    }

    async getEmployeeById(id) {
        const emp = await Employee.findById(id).lean();
        if (!emp) throw new Error('Không tìm thấy nhân viên');
        return { ...emp, monthlySalary: this._calculateMonthlySalary(emp.salaryPerDay) };
    }

    async createEmployee(data) {
        // ✅ Đã thêm kiểm tra email
        if (!data.employeeCode || !data.fullName || !data.salaryPerDay || !data.email) {
            throw new Error('Mã NV, Họ tên, Email và Lương/ngày là bắt buộc'); 
        }

        const role = this.VALID_ROLES.includes(data.role) ? data.role : 'sales_staff';

        try {
            const newEmp = await Employee.create({
                ...data,
                role,
                salaryPerDay: Number(data.salaryPerDay),
                hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
                age: data.age ? Number(data.age) : undefined,
            });
    
            return newEmp.toObject();
        } catch (error) {
            // Xử lý lỗi Mongoose Validation hoặc Unique Index
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`Giá trị '${data[field]}' cho trường ${field} đã tồn tại hoặc không hợp lệ.`);
            }
            throw error;
        }
    }

    async updateEmployee(id, data) {
        const emp = await Employee.findById(id);
        if (!emp) throw new Error('Không tìm thấy nhân viên');

        if (data.role && !this.VALID_ROLES.includes(data.role)) {
            throw new Error(`Vai trò không hợp lệ. Chọn: ${this.VALID_ROLES.join(' hoặc ')}`);
        }
        
        const updateData = { ...data };
        delete updateData.employeeCode; // Không cho phép update employeeCode
        
        try {
            const updated = await Employee.findByIdAndUpdate(
                id,
                {
                    ...updateData,
                    role: data.role || emp.role,
                    salaryPerDay: data.salaryPerDay ? Number(data.salaryPerDay) : emp.salaryPerDay,
                    hireDate: data.hireDate ? new Date(data.hireDate) : emp.hireDate,
                    age: data.age ? Number(data.age) : emp.age,
                },
                { new: true, runValidators: true }
            ).lean();
    
            return updated;
        } catch (error) {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new Error(`Giá trị '${data[field]}' cho trường ${field} đã tồn tại hoặc không hợp lệ.`);
            }
            throw error;
        }
    }

    async deleteEmployee(id) {
        const emp = await Employee.findByIdAndDelete(id);
        if (!emp) throw new Error('Không tìm thấy nhân viên để xóa');
        return emp;
    }
}

module.exports = new EmployeeService();