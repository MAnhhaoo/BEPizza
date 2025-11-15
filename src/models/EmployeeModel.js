const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeCode: { 
        type: String,
        required: [true, 'Mã nhân viên là bắt buộc'],
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, 'Họ và tên là bắt buộc'],
        trim: true,
    },
    // ✅ THÊM TRƯỜNG EMAIL
    email: { 
        type: String, 
        trim: true, 
        required: [true, 'Email là bắt buộc'], 
        unique: true,
        lowercase: true,
    }, 
    role: {
        type: String,
        enum: ['sales_staff', 'kitchen_staff'],
        default: 'sales_staff',
    },
    age: { type: Number, min: 18, max: 60 },
    address: { type: String, trim: true },
    phone: { type: String, trim: true, unique: true, sparse: true },

    salaryPerDay: { 
        type: Number,
        required: [true, 'Lương/ngày là bắt buộc'],
        min: [50000, 'Lương tối thiểu là 50,000'],
    },
    hireDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;