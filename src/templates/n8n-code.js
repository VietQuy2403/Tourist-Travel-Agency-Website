// Code để xử lý dữ liệu từ webhook và chuyển đổi thời gian
// Sử dụng trong node Code1 của n8n

// Lấy dữ liệu từ webhook
const data = items[0].json;

// Log ra để kiểm tra dữ liệu đầu vào
console.log("Dữ liệu nhận được:", JSON.stringify(data, null, 2));

// Kiểm tra dữ liệu đầu vào
if (!data) {
  console.log("Không có dữ liệu đầu vào");
  return [];
}

// Xử lý thời gian và định dạng lại
try {
  // Tạo một đối tượng Date mới từ chuỗi datetime nếu có
  let formattedDateTime = "Không có thông tin";
  if (data.datetime) {
    // Chuyển đổi datetime sang đối tượng Date
    const bookingDate = new Date(data.datetime);
    if (isNaN(bookingDate.getTime())) {
      console.log("Chuỗi datetime không hợp lệ:", data.datetime);
    } else {
      // Định dạng ngày giờ sang dạng tiếng Việt
      formattedDateTime = bookingDate.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  
  // Xử lý thời gian hủy nếu có
  let formattedCancelledAt = "Không có thông tin";
  if (data.cancelledAt) {
    const cancelDate = new Date(data.cancelledAt);
    if (!isNaN(cancelDate.getTime())) {
      formattedCancelledAt = cancelDate.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  
  // Chuẩn bị dữ liệu cho email
  const emailData = {
    templateData: {
      bookingId: data.bookingId || "Không xác định",
      name: data.name || "Quý khách",
      email: data.email || "",
      datetime: formattedDateTime,
      destination: data.destination || "Không xác định",
      cancelReason: data.cancelReason || "Không có lý do",
      cancelledAt: formattedCancelledAt,
      message: data.message || "Không có"
    }
  };
  
  // Trả về dữ liệu đã xử lý cho node tiếp theo
  return {
    json: {
      ...data,
      emailData
    }
  };
  
} catch (error) {
  console.log("Lỗi xử lý dữ liệu:", error.message);
  throw new Error("Lỗi xử lý dữ liệu: " + error.message);
} 