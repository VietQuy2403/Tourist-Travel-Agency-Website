import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    name: "",
    birthday: "" 
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      console.log("🔥 Bắt đầu đăng ký tài khoản...");

      // Gửi yêu cầu đăng ký đến API MongoDB
      const response = await axios.post("http://localhost:5000/api/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday
      });

      console.log("✅ Đăng ký thành công:", response.data);

      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("email", formData.email); // Lưu email để sử dụng ở ManageBooking

      alert("🎉 Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập sau khi đăng ký
    } catch (error) {
      console.error("❌ Lỗi đăng ký:", error);
      setErrorMessage(error.response?.data?.message || "Lỗi khi đăng ký. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center", background: "#fff", borderRadius: "8px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
      <h2>Đăng ký</h2>

      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>👤 Họ và tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nhập họ và tên"
            style={{ width: "100%", padding: "8px", fontSize: "16px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>📧 Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập email"
            style={{ width: "100%", padding: "8px", fontSize: "16px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>🎂 Ngày sinh:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", fontSize: "16px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>🔒 Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Nhập mật khẩu"
            style={{ width: "100%", padding: "8px", fontSize: "16px", marginTop: "5px" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px", backgroundColor: loading ? "#ccc" : "#28a745", color: "white", fontSize: "16px", cursor: "pointer", border: "none", borderRadius: "5px" }}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
        
        <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
          Đã có tài khoản? <Link to="/login" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>Đăng nhập ngay</Link>
        </p>
      </form>
    </div>
  );
}
