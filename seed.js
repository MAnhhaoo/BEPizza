const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/UserModels');
const Category = require('./src/models/CategoryModel');
const Product = require('./src/models/ProductModel');
const Order = require('./src/models/OrderModel');
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

// Hàm seed dữ liệu
const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
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
    await Order.create(sampleOrder);
    console.log('📦 Đã tạo order mẫu');

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