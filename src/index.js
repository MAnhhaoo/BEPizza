const express = require("express")
const dotenv = require ("dotenv")
const routes = require ('./Routes')
const cors = require('cors')
const { default: mongoose } = require("mongoose")
const bodyParser = require("body-parser")
const http = require('http')
const { Server } = require('socket.io')
dotenv.config()
const app = express()
const path = require("path");
const port = process.env.PORT || 3002

// dùng để lấy req trong body
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors())
app.use(bodyParser.json())

// Routes
routes(app);

// Tạo HTTP server và gắn Socket.IO để realtime updates
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET','POST','PUT','DELETE']
    }
});

// Lưu io vào app để controller/service có thể truy cập bằng req.app.get('io')
app.set('io', io);

// Thay đổi tên sự kiện từ 'join' thành 'join_customer_room'
io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    // ⭐ SỬA: Dùng tên sự kiện 'join_customer_room' và tên Room 'customer_{userId}'
    socket.on('join_customer_room', (userId) => { 
        if (!userId) return;
        const room = `customer_${userId}`; // Đổi tên Room cho rõ ràng
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
    });
    
    // ⭐ CẦN THÊM: Sự kiện rời Room (leave_customer_room)
    socket.on('leave_customer_room', (userId) => {
        if (!userId) return;
        const room = `customer_${userId}`;
        socket.leave(room);
        console.log(`Socket ${socket.id} left room ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected:', socket.id);
    });
});

// Kết nối mongoose
mongoose.connect(`${process.env.MONGO_DB}`).then(()=>{
        console.log("connect successfully")
}).catch((err)=>{
        console.log(err)
})

httpServer.listen(port , ()=>{
        console.log("running port " , + port)
})
