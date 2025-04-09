import React, { useState } from "react";
import MomoPayment from "../components/MomoPayment";
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    departureDate: "",
    departureTime: "08:00", // Thêm giờ bay mặc định
    departureCity: "Hà Nội",
    arrivalCity: "TP. Hồ Chí Minh",
    flightClass: "Economy",
    passengers: 1,
    amount: 1500000, // Giá vé mặc định (đơn vị VND)
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // ✅ Cập nhật form khi người dùng nhập
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Xử lý đặt vé
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('🚀 Bắt đầu gửi đặt vé...');
      
      // Kết hợp ngày và giờ
      const dateTime = new Date(formData.departureDate);
      const [hours, minutes] = formData.departureTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const bookingData = {
        ...formData,
        departureDate: dateTime.toISOString()
      };
      
      console.log('📋 Dữ liệu đặt vé:', bookingData);

      const response = await fetch('http://localhost:5000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('✅ Response từ server:', data);

      if (data.success) {
        console.log('🔥 Đặt vé thành công!');
        console.log('📋 Chi tiết đặt vé:', {
          id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          departureDate: data.data.departureDate,
          departureCity: data.data.departureCity,
          arrivalCity: data.data.arrivalCity,
          flightClass: data.data.flightClass,
          passengers: data.data.passengers
        });
        
        // Lưu thông tin đặt vé vào localStorage để sử dụng ở trang thanh toán
        localStorage.setItem('bookingData', JSON.stringify({
          bookingId: data.data._id,
          amount: data.data.totalPrice || data.data.amount * data.data.passengers
        }));
        
        // Chuyển hướng đến trang thanh toán
        navigate('/payment');
      } else {
        console.error('❌ Lỗi đặt vé:', data.message);
        alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('❌ Lỗi khi gửi request:', error);
      alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xử lý thanh toán thành công
  const handlePaymentSuccess = async () => {
    try {
      const backendURL = "http://localhost:5000/api/booking";
      const response = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          departureDate: formData.departureDate,
          departureCity: formData.departureCity,
          arrivalCity: formData.arrivalCity,
          flightClass: formData.flightClass,
          passengers: formData.passengers,
          orderId: bookingId,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi gửi email xác nhận");
      }

      alert("🎉 Đặt vé và thanh toán thành công! Email xác nhận sẽ được gửi.");
      setShowPayment(false);
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="booking p-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-6 text-white">
              <h6 className="text-white text-uppercase">Đặt vé máy bay</h6>
              <h1 className="text-white mb-4">Đặt vé trực tuyến</h1>
              <p className="mb-4">Chọn chuyến bay và đặt vé ngay.</p>
            </div>
            <div className="col-md-6">
              <h1 className="text-white mb-4">Đặt vé máy bay</h1>
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
              
              {!showPayment ? (
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
                          type="date"
                          className="form-control bg-transparent"
                          name="departureDate"
                          value={formData.departureDate}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="departureDate">Ngày khởi hành</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="time"
                          className="form-control bg-transparent"
                          name="departureTime"
                          value={formData.departureTime}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="departureTime">Giờ khởi hành</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select bg-transparent"
                          name="departureCity"
                          value={formData.departureCity}
                          onChange={handleChange}
                        >
                          <option value="Hà Nội">Hà Nội (HAN)</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (SGN)</option>
                          <option value="Đà Nẵng">Đà Nẵng (DAD)</option>
                          <option value="Nha Trang">Nha Trang (CXR)</option>
                          <option value="Phú Quốc">Phú Quốc (PQC)</option>
                          <option value="Đà Lạt">Đà Lạt (DLI)</option>
                        </select>
                        <label htmlFor="departureCity">Điểm khởi hành</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select bg-transparent"
                          name="arrivalCity"
                          value={formData.arrivalCity}
                          onChange={handleChange}
                        >
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (SGN)</option>
                          <option value="Hà Nội">Hà Nội (HAN)</option>
                          <option value="Đà Nẵng">Đà Nẵng (DAD)</option>
                          <option value="Nha Trang">Nha Trang (CXR)</option>
                          <option value="Phú Quốc">Phú Quốc (PQC)</option>
                          <option value="Đà Lạt">Đà Lạt (DLI)</option>
                        </select>
                        <label htmlFor="arrivalCity">Điểm đến</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select bg-transparent"
                          name="flightClass"
                          value={formData.flightClass}
                          onChange={handleChange}
                        >
                          <option value="Economy">Hạng phổ thông</option>
                          <option value="Premium Economy">Hạng phổ thông đặc biệt</option>
                          <option value="Business">Hạng thương gia</option>
                          <option value="First Class">Hạng nhất</option>
                        </select>
                        <label htmlFor="flightClass">Hạng vé</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="number"
                          className="form-control bg-transparent"
                          name="passengers"
                          min="1"
                          max="9"
                          value={formData.passengers}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="passengers">Số hành khách</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-outline-light w-100 py-3" type="submit" disabled={loading}>
                        {loading ? "⏳ Đang xử lý..." : "Tiếp tục thanh toán"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="payment-section bg-white p-4 rounded">
                  <h3 className="mb-4">Thanh toán</h3>
                  <MomoPayment
                    amount={formData.amount}
                    orderId={bookingId}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
