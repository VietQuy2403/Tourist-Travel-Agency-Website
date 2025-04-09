require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");
const connectDB = require("./src/config/db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

// Kết nối MongoDB
connectDB();

// Định nghĩa URL công khai cho tracking pixel
const PUBLIC_URL = process.env.PUBLIC_URL || 'https://tour-track.ngrok.io';

// Định nghĩa các webhook URL
const N8N_WEBHOOKS = {
  REGISTER: 'http://localhost:5678/webhook-test/32c718aa-6e8b-44db-b891-2d366f12e970',  // Webhook cho đăng ký
  BOOKING: 'http://localhost:5678/webhook-test/9650687e-eb23-48d4-bf85-a6692f35dade',   // Webhook cho đặt tour
  CANCELLATION: 'http://localhost:5678/webhook-test/165b31eb-7c16-4d64-b317-d6bb7e60d8eb', // Webhook cho hủy chuyến bay
  BIRTHDAY: 'http://localhost:5678/webhook-test/5079046e-4c23-4cbe-98af-762341a96c89' // Webhook cho chúc mừng sinh nhật
};

// Danh sách các ngày lễ ở Việt Nam
const holidays = [
  { date: '01-01', name: 'Tết Dương Lịch', message: 'Chúc bạn một năm mới tràn đầy may mắn và thành công!' },
  { date: '30-04', name: 'Ngày Giải phóng miền Nam', message: 'Chúc mừng ngày lễ thống nhất đất nước!' },
  { date: '01-05', name: 'Ngày Quốc tế Lao động', message: 'Chúc bạn có ngày lễ lao động vui vẻ và ý nghĩa!' },
  { date: '02-09', name: 'Ngày Quốc khánh', message: 'Chúc mừng ngày lễ độc lập 2/9!' },
  { date: '20-11', name: 'Ngày Nhà giáo Việt Nam', message: 'Chúc mừng ngày Nhà giáo Việt Nam 20/11!' },
  { date: '24-12', name: 'Lễ Giáng Sinh', message: 'Chúc bạn và gia đình có một Giáng sinh ấm áp, an lành!' },
  { date: '31-12', name: 'Tất niên', message: 'Chúc mừng ngày cuối cùng của năm, một năm mới đang chờ đón bạn!' },
  { date: '07-04', name: 'Giổ tổ Hùng Vương', message: '1 ngày tốt đẹp' }
  // Thêm ngày lễ âm lịch sẽ phức tạp hơn và cần thêm logic để tính toán
];

// ✅ Cấu hình CORS (Chỉ cho phép frontend của bạn)
app.use(cors({
  origin: "*", // Cho phép tất cả các origin trong môi trường development
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

// Phục vụ các file tĩnh
app.use(express.static('public'));
app.use('/assets', express.static('src/assets'));
app.use('/img', express.static('src/img'));
app.use('/lib', express.static('src/lib'));

// Thêm middleware để parse JSON
app.use(express.json());

// Thêm route để serve các file static từ thư mục assets
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/img', express.static(path.join(__dirname, 'src/img')));
app.use('/lib', express.static(path.join(__dirname, 'src/lib')));

// Cập nhật model schemas để hỗ trợ thêm tính năng
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: true },
  role: { type: String, default: "user" },
  potentialScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Thêm phương thức so sánh mật khẩu
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Trong môi trường thực tế, chúng ta sẽ sử dụng bcrypt.compare
    // Nhưng để đơn giản, chúng ta kiểm tra trực tiếp
    return this.password === candidatePassword;
  } catch (error) {
    throw new Error(error);
  }
};

// Hash mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  try {
    // Chỉ hash mật khẩu nếu nó được sửa đổi hoặc mới
    if (!this.isModified('password')) return next();
    
    // Trong môi trường thực tế, bạn nên sử dụng bcrypt
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    
    // Giữ nguyên mật khẩu để đơn giản hóa (chỉ trong demo)
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Schema Booking với hỗ trợ đặt vé máy bay
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departureTime: { type: String }, // Giờ khởi hành (được lưu riêng để hiển thị)
  departureCity: { type: String, required: true },
  arrivalCity: { type: String, required: true },
  flightClass: { type: String, required: true },
  passengers: { type: Number, required: true },
  amount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: "pending", enum: ["pending", "confirmed", "cancelled"] },
  cancelReason: { type: String },
  cancelledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  calendarEventId: { type: String },
  // Thêm trường để theo dõi nhắc nhở
  reminderSent: { type: Boolean, default: false },
  reminderSentTime: { type: Date }
});

// Models (chỉ khai báo một lần)
const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);

// ===== API đăng ký người dùng =====
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password, birthday } = req.body;
    console.log('📝 Received registration request:', { name, email, birthday });

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password || !birthday) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Tạo người dùng mới
    const user = new User({
      name,
      email,
      password,
      birthday: new Date(birthday)
    });

    await user.save();
    console.log('✅ User saved to MongoDB:', user._id);

    // Gửi thông tin đến n8n webhook để xử lý email
    try {
      console.log('📤 Sending registration data to n8n webhook:', N8N_WEBHOOKS.REGISTER);
      
      const webhookData = {
        type: 'welcome_email',
        userId: user._id.toString(),
        name,
        email,
        birthday,
        action: 'register'
      };

      const emailResponse = await axios.post(N8N_WEBHOOKS.REGISTER, webhookData);
      console.log('✅ Welcome email webhook response:', emailResponse.data);

      // Gửi thông tin đến webhook chúc mừng sinh nhật
      const birthdayData = {
        userId: user._id.toString(),
        name,
        email,
        birthday: new Date(birthday).toISOString(),
        action: 'schedule_birthday'
      };

      const birthdayResponse = await axios.post(N8N_WEBHOOKS.BIRTHDAY, birthdayData);
      console.log('✅ Birthday webhook response:', birthdayResponse.data);
    } catch (webhookError) {
      console.error('❌ Error triggering webhooks:', {
        message: webhookError.message,
        response: webhookError.response?.data,
        status: webhookError.response?.status,
        url: webhookError.config?.url
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        birthday: user.birthday 
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "✅ Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        birthday: user.birthday
      }
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ===== API đăng nhập =====
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email và password
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và password" });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Kiểm tra password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ===== Middleware xác thực =====
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Cần đăng nhập để thực hiện thao tác này" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Lỗi xác thực:", error);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ✅ Route xử lý đặt vé máy bay
app.post('/api/booking', async (req, res) => {
  try {
    console.log('📝 Received booking request:', req.body);
    
    const { name, email, departureDate, departureTime, departureCity, arrivalCity, flightClass, passengers, amount } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !departureDate || !departureCity || !arrivalCity || !flightClass || !passengers || !amount) {
      console.log('❌ Missing required fields:', { name, email, departureDate, departureCity, arrivalCity, flightClass, passengers, amount });
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng điền đầy đủ thông tin" 
      });
    }

    // Chuyển đổi departureDate thành đối tượng Date
    const formattedDepartureDate = new Date(departureDate);
    if (isNaN(formattedDepartureDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Ngày khởi hành không hợp lệ"
      });
    }

    // Lấy giờ từ đối tượng Date hoặc từ trường departureTime
    let departureTimeStr = departureTime || '';
    if (!departureTimeStr && formattedDepartureDate) {
      const hours = formattedDepartureDate.getHours().toString().padStart(2, '0');
      const minutes = formattedDepartureDate.getMinutes().toString().padStart(2, '0');
      departureTimeStr = `${hours}:${minutes}`;
    }

    // Tính toán totalPrice
    const parsedAmount = parseInt(amount);
    const parsedPassengers = parseInt(passengers);
    const totalPrice = parsedAmount * parsedPassengers;

    // Tạo booking mới
    const booking = new Booking({
      name,
      email,
      departureDate: formattedDepartureDate,
      departureTime: departureTimeStr,
      departureCity,
      arrivalCity,
      flightClass,
      passengers: parsedPassengers,
      amount: parsedAmount,
      totalPrice: totalPrice,
      status: 'confirmed'
    });

    console.log('📦 Creating booking:', booking);

    // Lưu booking vào database
    await booking.save();
    console.log('✅ Booking saved to database:', booking._id);

    // Định dạng ngày và giờ để hiển thị đẹp hơn
    const formattedDateStr = formattedDepartureDate.toLocaleDateString('vi-VN');
    const formattedDateTime = `${formattedDateStr} ${departureTimeStr}`;

    // Gửi webhook đến n8n
    try {
      console.log('📤 Sending webhook to n8n:', N8N_WEBHOOKS.BOOKING);
      await axios.post(N8N_WEBHOOKS.BOOKING, {
        name,
        email,
        departureDate: formattedDepartureDate.toISOString(),
        departureTime: departureTimeStr,
        departureCity,
        arrivalCity,
        flightClass,
        passengers,
        amount,
        bookingId: booking._id,
        formattedDateTime: formattedDateTime
      });
      console.log('✅ n8n webhook sent successfully');

      // Gửi webhook đến Google Calendar
      console.log('📅 Sending webhook to Google Calendar:', N8N_WEBHOOKS.CALENDAR);
      await axios.post(N8N_WEBHOOKS.CALENDAR, {
        summary: `Vé máy bay ${departureCity} - ${arrivalCity} - ${name}`,
        description: `Thông tin đặt vé:
Khách hàng: ${name}
Email: ${email}
Chuyến bay: ${departureCity} -> ${arrivalCity}
Ngày khởi hành: ${formattedDateStr}
Giờ khởi hành: ${departureTimeStr}
Hạng vé: ${flightClass}
Số hành khách: ${passengers}
Tổng tiền: ${amount.toLocaleString('vi-VN')} VNĐ`,
        location: `${departureCity} -> ${arrivalCity}`,
        start: {
          dateTime: formattedDepartureDate.toISOString(),
          timeZone: "Asia/Ho_Chi_Minh"
        },
        end: {
          dateTime: new Date(formattedDepartureDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          timeZone: "Asia/Ho_Chi_Minh"
        },
        attendees: [
          { email }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 180 } // Nhắc nhở 3 giờ trước khi bay
          ]
        }
      });
      console.log('✅ Google Calendar webhook sent successfully');

      res.json({
        success: true,
        data: booking
      });
    } catch (webhookError) {
      console.error('❌ Webhook error:', {
        message: webhookError.message,
        response: webhookError.response?.data,
        status: webhookError.response?.status,
        url: webhookError.config?.url
      });
      // Vẫn trả về success nếu lưu database thành công
      res.json({
        success: true,
        data: booking,
        message: 'Đặt vé thành công nhưng có lỗi khi gửi thông báo'
      });
    }
  } catch (error) {
    console.error('❌ Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi đặt vé',
      error: error.message
    });
  }
});

// ✅ API tạo payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe sử dụng cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Lỗi tạo payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API xử lý webhook từ Stripe
app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Lỗi webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý sự kiện thanh toán thành công
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    
    // Gửi email xác nhận qua n8n
    try {
      await axios.post(N8N_WEBHOOKS.BOOKING, {
        type: "payment_success",
        email: paymentIntent.metadata.email,
        amount: paymentIntent.amount / 100,
        bookingId: paymentIntent.metadata.bookingId,
        destination: paymentIntent.metadata.destination
      });
      console.log("✅ Đã gửi email xác nhận thanh toán");
    } catch (error) {
      console.error("❌ Lỗi gửi email xác nhận:", error);
    }
  }

  res.json({ received: true });
});

// ✅ API xử lý webhook từ Momo
app.post("/api/momo-webhook", async (req, res) => {
  try {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = req.body;

    // Xác thực chữ ký
    const rawSignature = `accessKey=${process.env.REACT_APP_MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.REACT_APP_MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    // Xử lý kết quả thanh toán
    if (resultCode === 0) {
      // Cập nhật trạng thái trong MongoDB
      await Booking.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentMethod: 'momo',
        transactionId: transId,
        paidAt: new Date()
      });

      // Gửi email xác nhận qua n8n
      await axios.post(N8N_WEBHOOKS.BOOKING, {
        type: "payment_success",
        orderId,
        amount,
        transId,
        message: "Thanh toán Momo thành công"
      });
      console.log("✅ Đã gửi email xác nhận thanh toán");
    } else {
      // Cập nhật trạng thái thất bại
      await Booking.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed'
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error("❌ Lỗi xử lý webhook Momo:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API tạo booking mới
app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      paymentStatus: 'pending',
      paymentMethod: 'momo'
    });
    await booking.save();

    // Sau khi lưu booking vào database và gửi webhook email
    // Thêm webhook để tạo sự kiện trên Google Calendar
    try {
      console.log('📅 Đang tạo sự kiện trên Google Calendar...');
      
      await axios.post(N8N_WEBHOOKS.CALENDAR, {
        name: booking.name,
        email: booking.email,
        destination: booking.destination,
        datetime: new Date(booking.datetime).toLocaleString('vi-VN'),
        message: booking.message || '',
        bookingId: booking._id.toString()
      });
      
      console.log('✅ Google Calendar webhook đã được gửi thành công');
    } catch (calendarError) {
      console.error('❌ Lỗi khi gửi Google Calendar webhook:', calendarError);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Lỗi tạo booking:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API lấy danh sách bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách bookings:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API lấy danh sách booking sắp diễn ra (cho tính năng nhắc nhở)
// Chú ý: Đặt lên trước API chi tiết booking để tránh xung đột
app.get("/api/bookings/upcoming", async (req, res) => {
  try {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3); // Lấy các booking trong 3 ngày tới
    
    console.log('Đang tìm booking từ', now.toISOString(), 'đến', threeDaysLater.toISOString());
    
    // Tìm tất cả booking có departureDate từ hiện tại đến 3 ngày sau
    const upcomingBookings = await Booking.find({
      departureDate: { $gte: now, $lte: threeDaysLater },
      status: 'confirmed' // Chỉ lấy các booking đã xác nhận
    }).sort({ departureDate: 1 });
    
    console.log('Tìm thấy', upcomingBookings.length, 'booking sắp diễn ra');
    
    // Lấy thông tin chi tiết của từng booking
    const bookingsWithDetails = upcomingBookings.map(booking => {
      // Định dạng ngày và giờ để hiển thị đẹp hơn
      const formattedDateStr = booking.departureDate.toLocaleDateString('vi-VN');
      const formattedTimeStr = booking.departureTime || '';
      const formattedDateTime = `${formattedDateStr} ${formattedTimeStr}`;
      
      return {
        bookingId: booking._id,
        name: booking.name,
        email: booking.email,
        departureDate: booking.departureDate,
        departureTime: booking.departureTime || '',
        departureCity: booking.departureCity,
        arrivalCity: booking.arrivalCity,
        flightClass: booking.flightClass,
        passengers: booking.passengers,
        amount: booking.amount,
        totalPrice: booking.totalPrice,
        status: booking.status,
        formattedDateTime: formattedDateTime,
        formattedDepartureDate: formattedDateStr
      };
    });
    
    res.json({
      success: true,
      count: bookingsWithDetails.length,
      data: bookingsWithDetails
    });
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách booking sắp diễn ra:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ✅ API lấy chi tiết booking
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }
    res.json(booking);
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết booking:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API cập nhật điểm khách hàng tiềm năng
app.post("/api/track-email-open/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query; // 'register' hoặc 'booking'

    // Tìm user và tăng điểm
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Tăng điểm dựa vào loại email
    let increaseAmount = 1;
    if (type === 'booking') {
      increaseAmount = 2; // Đặt tour quan trọng hơn đăng ký
    }

    user.potentialScore += increaseAmount;
    await user.save();

    // Trả về một pixel trong suốt
    res.setHeader('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    console.error("❌ Lỗi cập nhật điểm:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API lấy điểm khách hàng tiềm năng
app.get("/api/potential-score/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      potentialScore: user.potentialScore
    });
  } catch (error) {
    console.error("❌ Lỗi lấy điểm:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API cập nhật điểm khách hàng tiềm năng theo email
app.post("/api/track-email-open/by-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { type } = req.query || 'register';
    
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    
    // Tăng điểm dựa vào loại email
    let increaseAmount = 1; // Mặc định cho register
    if (type === 'booking') {
      increaseAmount = 2; // Đặt tour
    } else if (type === 'reminder') {
      increaseAmount = 0.5; // Nhắc nhở (tăng ít hơn)
    }
    
    if (increaseAmount > 0) {
      user.potentialScore += increaseAmount;
      await user.save();
      console.log(`✅ Đã tăng ${increaseAmount} điểm tiềm năng cho user ${user.name} (${email})`);
    }
    
    // Trả về một pixel trong suốt
    res.setHeader('Content-Type', 'image/gif');
    res.send(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
  } catch (error) {
    console.error("❌ Lỗi cập nhật điểm:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API lấy điểm khách hàng tiềm năng theo email
app.get("/api/potential-score/by-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      potentialScore: user.potentialScore,
      trackingUrl: `${PUBLIC_URL}/api/track-email-open/by-email/${email}` // URL đầy đủ cho tracking
    });
  } catch (error) {
    console.error("❌ Lỗi lấy điểm:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API hiển thị tất cả điểm tiềm năng
app.get("/api/potential-scores", async (req, res) => {
  try {
    const users = await User.find().select('name email potentialScore createdAt');
    
    res.json({
      success: true,
      count: users.length,
      data: users.map(user => ({
        userId: user._id,
        name: user.name,
        email: user.email,
        potentialScore: user.potentialScore,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("❌ Lỗi lấy điểm:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API test tăng điểm tiềm năng (để demo)
app.get("/api/test-increase-score/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { type } = req.query || 'register';
    
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    
    // Tăng điểm dựa vào loại
    let increaseAmount = 1;
    if (type === 'booking') {
      increaseAmount = 2;
    }
    
    user.potentialScore += increaseAmount;
    await user.save();
    
    res.json({
      success: true,
      message: `Đã tăng ${increaseAmount} điểm tiềm năng`,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        potentialScore: user.potentialScore
      }
    });
  } catch (error) {
    console.error("❌ Lỗi tăng điểm:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route hủy booking
app.post('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    
    console.log(`🔄 Đang xử lý yêu cầu hủy chuyến bay ID: ${id}`);
    
    // Tìm booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy booking' });
    }
    
    // Cập nhật trạng thái booking
    booking.status = 'cancelled';
    booking.cancelReason = cancelReason || 'Không có lý do';
    booking.cancelledAt = new Date();
    await booking.save();
    
    console.log(`✅ Đã cập nhật trạng thái booking: ${booking._id} thành cancelled`);

    // Chuẩn bị dữ liệu đầy đủ để gửi tới webhook
    const cancellationData = {
      bookingId: booking._id.toString(),
      name: booking.name,
      email: booking.email,
      departureCity: booking.departureCity,
      arrivalCity: booking.arrivalCity,
      departureDate: booking.departureDate,
      passengers: booking.passengers,
      flightClass: booking.flightClass,
      amount: booking.amount,
      totalPrice: booking.totalPrice || booking.amount,
      status: booking.status,
      cancelReason: booking.cancelReason,
      cancelledAt: new Date().toLocaleString('vi-VN'),
      formattedDepartureDate: new Date(booking.departureDate).toLocaleString('vi-VN'),
      calendarEventId: booking.calendarEventId // ID sự kiện Calendar
    };
    
    console.log('📤 Đang gửi thông tin hủy chuyến bay tới n8n:', cancellationData);

    // Gửi webhook để xử lý email hủy chuyến bay
    try {
      await axios.post(N8N_WEBHOOKS.CANCELLATION, cancellationData);
      console.log('✅ Cancellation email webhook sent successfully');
    } catch (webhookError) {
      console.error('❌ Error sending cancellation webhook:', webhookError);
    }

    res.json({
      success: true,
      message: 'Đã hủy chuyến bay thành công',
      booking
    });
  } catch (error) {
    console.error('❌ Lỗi khi hủy booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ API lấy danh sách bookings đã bị hủy
app.get("/api/bookings/cancelled", async (req, res) => {
  try {
    const cancelledBookings = await Booking.find({ status: "cancelled" }).sort({ cancelledAt: -1 });
    res.json({
      success: true,
      count: cancelledBookings.length,
      data: cancelledBookings
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách bookings đã hủy:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===== API lấy danh sách sinh nhật trong ngày =====
app.get("/api/birthdays/today", async (req, res) => {
  try {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Tìm tất cả người dùng có sinh nhật trong ngày
    const users = await User.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$birthday" }, todayMonth] },
          { $eq: [{ $dayOfMonth: "$birthday" }, todayDay] }
        ]
      }
    });

    console.log(`🎂 Tìm thấy ${users.length} người dùng có sinh nhật hôm nay`);

    // Gửi thông tin đến n8n webhook để xử lý email chúc mừng sinh nhật
    for (const user of users) {
      try {
        console.log(`📤 Gửi email chúc mừng sinh nhật cho ${user.name}`);
        
        const birthdayData = {
          type: 'birthday_email',
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
          birthday: user.birthday,
          action: 'send_birthday_wish'
        };

        const response = await axios.post(N8N_WEBHOOKS.BIRTHDAY, birthdayData);
        console.log(`✅ Đã gửi email chúc mừng sinh nhật cho ${user.name}:`, response.data);
      } catch (webhookError) {
        console.error(`❌ Lỗi gửi email chúc mừng sinh nhật cho ${user.name}:`, {
          message: webhookError.message,
          response: webhookError.response?.data,
          status: webhookError.response?.status
        });
      }
    }

    res.json({
      success: true,
      message: `Đã tìm thấy ${users.length} người dùng có sinh nhật hôm nay`,
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday
      }))
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách sinh nhật:", error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server", 
      error: error.message 
    });
  }
});

// ===== API kiểm tra ngày lễ hôm nay =====
app.get("/api/holidays/today", async (req, res) => {
  try {
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    console.log('📅 Kiểm tra ngày lễ:', todayStr);

    const holiday = holidays.find(h => h.date === todayStr);

    if (holiday) {
      console.log(`🎉 Hôm nay là ${holiday.name}`);
      
      // Lấy danh sách tất cả người dùng
      const users = await User.find({});
      
      // Chuẩn bị dữ liệu phản hồi
      const usersList = users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        holidayName: holiday.name,
        holidayMessage: holiday.message
      }));
      
      res.json({
        success: true,
        message: `Hôm nay là ${holiday.name}`,
        holiday: holiday,
        users: usersList
      });
    } else {
      console.log('📅 Hôm nay không phải là ngày lễ');
      res.json({
        success: false,
        message: "Hôm nay không phải là ngày lễ"
      });
    }
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra ngày lễ:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API cập nhật calendarEventId
app.post('/api/bookings/:id/calendar', async (req, res) => {
  try {
    const { id } = req.params;
    const { calendarEventId } = req.body;
    
    console.log(`📅 Cập nhật calendarEventId cho booking ${id}:`, calendarEventId);
    
    if (!calendarEventId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu calendarEventId' 
      });
    }
    
    // Cập nhật booking với calendarEventId
    const booking = await Booking.findByIdAndUpdate(
      id,
      { calendarEventId },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy booking' 
      });
    }
    
    console.log('✅ Đã cập nhật calendarEventId thành công');

    res.json({ 
      success: true,
      message: 'Đã cập nhật calendarEventId',
      booking
    });
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật calendarEventId:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API endpoint để cập nhật trạng thái đã nhắc cho booking
app.put('/api/bookings/:id/reminder', async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderSent, reminderSentTime } = req.body;
    
    console.log(`📝 Cập nhật trạng thái nhắc nhở cho booking ${id}`);
    
    // Cập nhật booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { 
        reminderSent: reminderSent,
        reminderSentTime: reminderSentTime || new Date()
      },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái nhắc nhở thành công',
      data: booking
    });
  } catch (error) {
    console.error('❌ Lỗi cập nhật trạng thái nhắc nhở:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật trạng thái nhắc nhở',
      error: error.message
    });
  }
});

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
