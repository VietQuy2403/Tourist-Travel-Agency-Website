import React, { useState } from "react";
import { registerUser } from "../firebaseConfig"; // Hàm đăng ký Firebase
import { useNavigate } from "react-router-dom";

export default function RegisterScreen() {
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
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

      // 🛠 Đăng ký tài khoản Firebase
      const user = await registerUser(formData.email, formData.password);

      console.log("✅ Firebase userCredential:", user);

      if (!user || !user.uid) {
        throw new Error("Không thể lấy UID từ Firebase.");
      }

      console.log("✅ Đã lấy UID:", user.uid);

      // 📨 Gửi dữ liệu đăng ký đến backend (server.js)
      const bodyData = {
        email: formData.email,
        fullName: formData.fullName || "Người dùng chưa đặt tên",
        uid: user.uid, // ✅ Đảm bảo có UID
      };

      console.log("📤 Đang gửi dữ liệu đến backend:", bodyData);

      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Lỗi từ server:", errorData);
        throw new Error(errorData.message || "Lỗi khi gửi dữ liệu đến server");
      }

      console.log("✅ Phản hồi từ server:", await response.json());
      alert("🎉 Đăng ký thành công! Email xác nhận đã được gửi.");
      navigate("/login"); // Chuyển hướng sau khi đăng ký
    } catch (error) {
      console.error("❌ Lỗi toàn bộ quá trình:", error);
      setErrorMessage(error.message);
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
            name="fullName"
            value={formData.fullName}
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
      </form>
    </div>
  );
}
