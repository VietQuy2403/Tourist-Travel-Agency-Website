                           
![Awesome ReadME](https://raw.githubusercontent.com/ParasSalunke/Tourist-Travel-Agency-Website/main/travel-agency-react-template.jpg)
 
# Tourist - Travel Agency React Website

[![GitHub](https://img.shields.io/github/license/navendu-pottekkat/awesome-readme)](https://img.shields.io/github/license/navendu-pottekkat/awesome-readme)

###

# Languages-Frameworks-Tools Used

###

<div align="left">
  <img src="https://skillicons.dev/icons?i=react" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=js" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=html" height="40" alt="html5 logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=css" height="40" alt="css3 logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=bootstrap" height="40" alt="bootstrap logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=jquery" height="40" alt="jquery logo"  />
</div>

###

# License

MIT License

Copyright (c) 2024 Paras Nitin Salunke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Cài đặt

```bash
# Cài đặt các gói phụ thuộc
npm install

# Cài đặt các gói cụ thể (nếu cần)
npm install process@0.11.10 --save-exact
npm install stream-browserify@3.0.0 --save-dev --save-exact
```

## Khởi động ứng dụng

```bash
# Khởi động cả frontend và backend cùng lúc
npm run start-all

# Hoặc khởi động riêng lẻ:
# Khởi động backend server
npm run server

# Khởi động frontend React
npm start
```

## Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Quản lý đặt tour: http://localhost:3000/manage-booking

## Các thao tác cơ bản

1. Đăng ký tài khoản mới
2. Đăng nhập
3. Đặt tour từ trang chủ
4. Xem và quản lý các tour đã đặt

## Cấu hình Tracking Pixel cho Email

Để tracking pixel hoạt động khi người dùng mở email, bạn cần sử dụng một URL public thay vì localhost. Có hai cách:

### Cách 1: Sử dụng ngrok (cho môi trường phát triển)

1. Đăng ký tài khoản tại [ngrok.com](https://ngrok.com)
2. Tải và cài đặt ngrok
3. Chạy lệnh sau để tạo tunnel:
   ```
   ngrok http 5000
   ```
4. Ngrok sẽ tạo một URL public (ví dụ: https://abc123.ngrok.io)
5. Sửa URL trong file `server.js`:
   ```javascript
   const PUBLIC_URL = process.env.PUBLIC_URL || 'https://abc123.ngrok.io'; // Thay đổi URL này
   ```
6. Khởi động lại server
7. Sửa template email trong n8n để sử dụng URL ngrok:
   ```html
   <img src="https://abc123.ngrok.io/api/track-email-open/by-email/{{$json.email}}?type=register" width="1" height="1" alt="" />
   ```

### Cách 2: Sử dụng domain thật (cho môi trường production)

1. Đăng ký một tên miền
2. Cấu hình DNS trỏ đến server của bạn
3. Cấu hình SSL để sử dụng HTTPS
4. Thêm vào file `.env`:
   ```
   PUBLIC_URL=https://your-domain.com
   ```
5. Khởi động lại server
6. Sửa template email trong n8n để sử dụng domain thật:
   ```html
   <img src="https://your-domain.com/api/track-email-open/by-email/{{$json.email}}?type=register" width="1" height="1" alt="" />
   ```

## Tự động hoá với n8n

1. Đảm bảo n8n đang chạy: `n8n start`
2. Tạo workflow cho đăng ký và đặt tour
3. Cấu hình webhook node với đúng URL
4. Thêm tracking pixel vào template email
5. Kích hoạt workflow
