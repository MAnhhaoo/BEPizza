const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/UserModels');
const Category = require('./src/models/CategoryModel');
const Product = require('./src/models/ProductModel');
const Order = require('./src/models/OrderModel');
const Review = require('./src/models/ReviewModel');
const Employee = require('./src/models/EmployeeModel');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log('Kết nối MongoDB thành công');
  } catch (error) {
    console.error(' Lỗi kết nối:', error);
    process.exit(1);
  }
};

// Dữ liệu mẫu
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    phone: 1234567890,
    address: '123 Admin Street'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    phone: 9876543210,
    address: '456 Customer Ave'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    phone: 5555555555,
    address: '789 User Road'
  }
];

const categories = [
  {
    name: 'Pizza Truyền thống',
    description: 'Các loại pizza cổ điển được yêu thích'
  },
  {
    name: 'Pizza Đặc biệt',
    description: 'Các loại pizza độc đáo của nhà hàng'
  },
  {
    name: 'Pizza Chay',
    description: 'Pizza không thịt, dành cho người ăn chay'
  }
];

const products = [
  {
    name: 'Pizza Hải sản',
    price: 229000,
    description: 'Tôm, mực, cá hồi và rau củ tươi ngon',
    image: '/uploads/seafood-pizza.jpg'
  },
  {
    name: 'Pizza Margherita',
    price: 189000,
    description: 'Cà chua, phô mai mozzarella, lá oregano',
    image: '/uploads/margherita-pizza.jpg'
  },
  {
    name: 'Pizza Pepperoni',
    price: 209000,
    description: 'Xúc xích pepperoni, phô mai, sốt cà chua',
    image: '/uploads/pepperoni-pizza.jpg'
  },
  {
    name: 'Pizza Chay Mediterranean',
    price: 199000,
    description: 'Ô liu, nấm, ớt chuông, hành tây',
    image: '/uploads/veggie-pizza.jpg'
  }
];

const employees = [
  {
    employeeCode: 'EMP001',
    fullName: 'Nguyễn Văn A',
    email: 'nguyen.a@bepizza.com',
    role: 'sales_staff',
    age: 25,
    address: '123 Main Street, HCMC',
    phone: '0912345678',
    salaryPerDay: 300000,
    hireDate: new Date('2023-01-15')
  },
  {
    employeeCode: 'EMP002',
    fullName: 'Trần Thị B',
    email: 'tran.b@bepizza.com',
    role: 'kitchen_staff',
    age: 28,
    address: '456 Elm Street, HCMC',
    phone: '0923456789',
    salaryPerDay: 250000,
    hireDate: new Date('2023-02-20')
  },
  {
    employeeCode: 'EMP003',
    fullName: 'Lê Văn C',
    email: 'le.c@bepizza.com',
    role: 'kitchen_staff',
    age: 30,
    address: '789 Oak Street, HCMC',
    phone: '0934567890',
    salaryPerDay: 280000,
    hireDate: new Date('2023-03-10')
  }
];

// Hàm seed dữ liệu
const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Employee.deleteMany();
    console.log('🧹 Đã xóa dữ liệu cũ');

    // Tạo users với password được hash
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return User.create({ ...user, password: hashedPassword });
      })
    );
    console.log('👤 Đã tạo users');

    // Tạo categories
    const createdCategories = await Category.insertMany(categories);
    console.log('📑 Đã tạo categories');

    // Tạo products và gán category
    const productsWithCategories = products.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id
    }));
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('🍕 Đã tạo products');

    // Tạo một đơn hàng mẫu
    const sampleOrder = {
      user: createdUsers[1]._id, // user thường (không phải admin)
      orderItems: [
        {
          name: createdProducts[0].name,
          qty: 2,
          price: createdProducts[0].price,
          product: createdProducts[0]._id
        },
        {
          name: createdProducts[1].name,
          qty: 1,
          price: createdProducts[1].price,
          product: createdProducts[1]._id
        }
      ],
      shippingAddress: {
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'Vietnam'
      },
      itemPrice: createdProducts[0].price * 2 + createdProducts[1].price,
      shippingPrice: 30000,
      taxPrice: 20000,
      totalPrice: (createdProducts[0].price * 2 + createdProducts[1].price + 50000),
      status: 'Đã xác nhận'
    };
    const createdOrder = await Order.create(sampleOrder);
    console.log('📦 Đã tạo order mẫu');

    // Tạo reviews mẫu
    const reviews = [
      {
        user: createdUsers[1]._id,
        product: createdProducts[0]._id,
        order: createdOrder._id,
        rating: 5,
        comment: 'Pizza rất ngon, phục vụ nhanh chóng!'
      },
      {
        user: createdUsers[1]._id,
        product: createdProducts[1]._id,
        order: createdOrder._id,
        rating: 4,
        comment: 'Tốt, nhưng đóng gói có thể tốt hơn'
      },
      {
        user: createdUsers[2]._id,
        product: createdProducts[2]._id,
        order: createdOrder._id,
        rating: 5,
        comment: 'Siêu ngon, sẽ mua lại!'
      }
    ];
    await Review.insertMany(reviews);
    console.log('⭐ Đã tạo reviews mẫu');

    // Tạo employees mẫu
    await Employee.insertMany(employees);
    console.log('👔 Đã tạo employees mẫu');

    console.log('✅ Hoàn tất seed dữ liệu!');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

// Chạy seed
connectDB().then(() => {
  seedData();
});