## BEPizza — Backend

Đây là backend cho dự án BEPizza (REST API) viết bằng Node.js/Express. README này hướng dẫn cách cài đặt, cấu hình môi trường, chạy ứng dụng và mô tả cấu trúc thư mục chính.

## Tính năng chính
- API quản lý người dùng (đăng ký, đăng nhập, thông tin người dùng)
- Mô hình sản phẩm và đơn hàng (skeleton models có sẵn)

## Tiền đề (Prerequisites)
- Node.js (>= 14.x) và npm
- MongoDB (local hoặc Atlas)

## Cài đặt
Mở terminal ở thư mục gốc dự án và chạy:

```bash
npm install
```

Nếu bạn muốn chạy ở chế độ phát triển với nodemon (nếu đã cài trong devDependencies):

```bash
npm run dev
```

Hoặc chạy production:

```bash
npm start
```

## Cấu hình môi trường
Tạo file `.env` ở thư mục gốc với các biến tối thiểu sau (ví dụ):

```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/bepizza
JWT_SECRET=your_jwt_secret_here
# Thêm các biến cần thiết khác tại đây
```

Ghi chú: tên biến phải khớp với cách sử dụng trong mã nguồn (ví dụ `process.env.MONGO_URI`, `process.env.JWT_SECRET`).

## Chạy ứng dụng
- Chạy local: `npm run dev` (nodemon) hoặc `npm start`.
- Mở trình duyệt hoặc dùng Postman để gửi request tới `http://localhost:$PORT` (PORT từ `.env`, mặc định 3002).

## Cấu trúc thư mục (tổng quan)
Thư mục chính trong repo:

```
src/
    index.js                # Entry point ứng dụng
    Controller/
        UserController.js     # Controller xử lý request liên quan user
    models/
        UserModels.js         # Model/Schema người dùng
        ProductModel.js       # Model/Schema sản phẩm
        OrderModel.js         # Model/Schema đơn hàng
    Routes/
        index.js              # Router chính
        UserRouter.js         # Router cho user
    Service/
        UserService.js        # Logic nghiệp vụ liên quan user

package.json
README.MD
.env (local, không commit)
```

## Các endpoint chính (ví dụ)
Do repo hiện có `UserController`, `UserRouter` và `UserService`, có thể có các endpoint như:

- POST /api/users/register  — đăng ký người dùng
- POST /api/users/login     — đăng nhập (trả về JWT)
- GET  /api/users/me        — lấy thông tin người dùng (cần token)

Lưu ý: Kiểm tra `src/Routes/UserRouter.js` và `src/Controller/UserController.js` để biết đường dẫn và payload chính xác.

## Mẹo phát triển
- Kiểm tra kỹ `process.env` trong file `src/index.js` để đảm bảo các biến môi trường được load (`dotenv.config()`).
- Thêm logging/cors/body-parser nếu cần (project có đề cập tới `cors`, `body-parser`).

## Kiểm tra & Debug
- Sử dụng Postman / Insomnia để gọi API
- Kiểm tra kết nối MongoDB bằng `MONGO_URI` trong `.env`




