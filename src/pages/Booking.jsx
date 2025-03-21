import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    datetime: "",
    destination: "Điểm đến 1",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Cập nhật form khi người dùng nhập
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Xử lý đặt phòng
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      console.log("🚀 Bắt đầu gửi booking...");

      // Kiểm tra Firestore có hoạt động không
      const testQuery = await getDocs(collection(db, "bookings"));
      console.log("✅ Firestore hoạt động:", testQuery.docs.length, "documents.");

      // ✅ Thêm vào Firestore
      const bookingRef = await addDoc(collection(db, "bookings"), {
        ...formData,
        createdAt: new Date(),
        paymentStatus: "pending",
      });

      console.log("🔥 Đặt phòng thành công! ID:", bookingRef.id);
      alert("🎉 Đặt phòng thành công! Email xác nhận sẽ được gửi.");

      // ✅ Gửi request đến backend
      const backendURL = "http://localhost:5000/api/booking";
      console.log("📡 Gửi request đến backend:", backendURL);

      const response = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          datetime: formData.datetime,
          destination: formData.destination,
          message: formData.message || "Không có yêu cầu đặc biệt",
          orderId: bookingRef.id,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("❌ Lỗi từ backend:", responseData);
        throw new Error(responseData.message || "Lỗi không xác định từ server.");
      }

      console.log("✅ API backend gửi thành công!", responseData);
      alert("📩 Email xác nhận đặt phòng đã được gửi!");
    } catch (error) {
      console.error("❌ Lỗi khi đặt phòng:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="booking p-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-6 text-white">
              <h6 className="text-white text-uppercase">Đặt phòng</h6>
              <h1 className="text-white mb-4">Đặt chỗ trực tuyến</h1>
              <p className="mb-4">Chọn điểm đến yêu thích và đặt phòng ngay.</p>
            </div>
            <div className="col-md-6">
              <h1 className="text-white mb-4">Đặt tour</h1>
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control bg-transparent"
                        name="name"
                        placeholder="Tên"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">Tên</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control bg-transparent"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="datetime-local"
                        className="form-control bg-transparent"
                        name="datetime"
                        value={formData.datetime}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="datetime">Ngày & Giờ</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select bg-transparent"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                      >
                        <option value="Điểm đến 1">Điểm đến 1</option>
                        <option value="Điểm đến 2">Điểm đến 2</option>
                        <option value="Điểm đến 3">Điểm đến 3</option>
                      </select>
                      <label htmlFor="destination">Điểm đến</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control bg-transparent"
                        placeholder="Yêu cầu đặc biệt"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        style={{ height: 100 }}
                      />
                      <label htmlFor="message">Yêu cầu đặc biệt</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-outline-light w-100 py-3" type="submit" disabled={loading}>
                      {loading ? "⏳ Đang đặt phòng..." : "Đặt phòng & Gửi Email"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
