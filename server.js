require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// ✅ Cấu hình CORS (Chỉ cho phép frontend của bạn)
app.use(cors({
  origin: "http://localhost:3000", // ⚠️ Thay đổi nếu frontend chạy ở port khác
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json()); // Middleware để parse JSON

// ✅ API đăng ký tài khoản (Gửi dữ liệu đến n8n)
app.post("/api/register", async (req, res) => {
  try {
    const { email, fullName, uid } = req.body;

    if (!email || !fullName || !uid) {
      console.log("⚠️ Dữ liệu bị thiếu:", { email, fullName, uid });
      return res.status(400).json({ message: "⚠️ Thiếu email, fullName hoặc UID" });
    }

    const webhookURL = "http://localhost:5678/webhook/32c718aa-6e8b-44db-b891-2d366f12e970";
    console.log("📡 Đang gửi dữ liệu đến n8n:", { email, fullName, uid });

    const response = await axios.post(webhookURL, { email, fullName, uid });

    console.log("✅ Phản hồi từ n8n:", response.data);
    res.json({ message: "✅ Đăng ký thành công!", data: response.data });

  } catch (error) {
    console.error("❌ Lỗi gửi Webhook n8n:", error.response?.data || error.message);

    res.status(500).json({ 
      message: "❌ Lỗi khi gửi dữ liệu lên n8n", 
      error: error.response?.data || error.message 
    });
  }
});


// ✅ API đặt phòng
app.post("/api/booking", async (req, res) => {
  try {
    const { name, email, datetime, destination, message } = req.body;

    if (!name || !email || !datetime || !destination) {
      console.log("⚠️ Thiếu thông tin đặt phòng:", req.body);
      return res.status(400).json({ message: "⚠️ Thiếu thông tin đặt phòng" });
    }

    

    const webhookURL = "http://localhost:5678/webhook/9650687e-eb23-48d4-bf85-a6692f35dade";
    console.log("📡 Đang gửi yêu cầu đặt phòng đến n8n:", req.body);
    const response = await axios.post(webhookURL, { name, email, datetime, destination, message });
    

    console.log("✅ Phản hồi từ n8nn8n:", response.data);
    res.json({ message: "✅ Đặt phòng thành công!", data: response.data });
    

  } catch (error) {
    console.error("❌ Lỗi gửi Webhook n8n:", error.response?.data || error.message);

    res.status(500).json({ 
      message: "❌ Lỗi khi gửi dữ liệu lên n8n", 
      error: error.response?.data || error.message 
    });
  }
});

// ✅ Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
