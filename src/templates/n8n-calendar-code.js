// Code để xử lý dữ liệu booking và tạo sự kiện Google Calendar với timezone Việt Nam
// Dùng cho node Code1 trong n8n

// Lấy dữ liệu từ webhook
const data = items[0].json;

// Log ra để kiểm tra dữ liệu đầu vào
console.log("Dữ liệu booking:", JSON.stringify(data, null, 2));

// Kiểm tra dữ liệu đầu vào
if (!data) {
  console.log("Không có dữ liệu đầu vào hợp lệ");
  return [];
}

// Lấy dữ liệu từ body nếu có
const bookingData = data.body || data;

// Xử lý dữ liệu cho Google Calendar
try {
  // Xử lý thời gian với timezone Việt Nam
  let startDate, endDate;
  
  // LƯU Ý QUAN TRỌNG VỀ TIMEZONE:
  // Mặc dù Google Calendar API có thể trả về múi giờ mặc định của tài khoản Google (thường là America/New_York),
  // sự kiện sẽ vẫn được lưu trữ và hiển thị đúng múi giờ Việt Nam trong Calendar thực tế.
  
  if (bookingData.datetime) {
    // Chuyển đổi thời gian sang đối tượng Date
    let bookingTime;
    
    try {
      // Thử phân tích datetime với nhiều định dạng khác nhau
      if (bookingData.datetime.includes('T')) {
        bookingTime = new Date(bookingData.datetime);
      } else {
        // Nếu không có 'T', thêm vào để đảm bảo định dạng ISO
        const parts = bookingData.datetime.split(' ');
        if (parts.length >= 2) {
          bookingTime = new Date(`${parts[0]}T${parts[1]}`);
        } else {
          bookingTime = new Date(bookingData.datetime);
        }
      }
      
      if (isNaN(bookingTime.getTime())) {
        throw new Error("Không thể phân tích ngày tháng");
      }
    } catch (err) {
      console.log("Lỗi phân tích datetime:", err, "Input:", bookingData.datetime);
      throw new Error(`Định dạng thời gian không hợp lệ: ${bookingData.datetime}`);
    }
    
    // Sử dụng trực tiếp đối tượng Date và để Google Calendar API xử lý việc chuyển đổi múi giờ
    // Định dạng RFC3339 với offset +07:00 (Việt Nam)
    const offset = '+07:00';
    
    const formatDateTime = (date) => {
      return date.toISOString().replace('Z', offset);
    };
    
    // Tính toán thời gian bắt đầu và kết thúc
    const startTime = bookingTime;
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
    
    startDate = {
      dateTime: formatDateTime(startTime),
      timeZone: "Asia/Ho_Chi_Minh"
    };
    
    endDate = {
      dateTime: formatDateTime(endTime),
      timeZone: "Asia/Ho_Chi_Minh"
    };
    
    console.log("Start time (ISO với offset +07:00):", startDate.dateTime);
    console.log("End time (ISO với offset +07:00):", endDate.dateTime);
  } else {
    throw new Error("Thiếu thông tin thời gian đặt tour");
  }
  
  // Tạo dữ liệu cho Google Calendar
  const calendarEvent = {
    // Thông tin tour
    summary: `Tour ${bookingData.destination || "Không xác định"} - ${bookingData.name || "Khách hàng"}`,
    location: bookingData.destination || "Không xác định",
    description: `Booking ID: ${bookingData.bookingId || "N/A"}
Email: ${bookingData.email || "N/A"}
Số lượng: ${bookingData.amount || 1} người
Ghi chú: ${bookingData.message || "Không có"}`,
    
    // Thời gian với timezone Việt Nam
    start: startDate,
    end: endDate,
    
    // Thông báo nhắc nhở
    reminders: {
      useDefault: true
    },
    
    // Thêm người tham dự (khách hàng)
    attendees: [
      { email: bookingData.email || "" }
    ],
    
    // Đặt timezone ưu tiên cho event
    timeZone: "Asia/Ho_Chi_Minh"
  };
  
  console.log("Dữ liệu calendar:", JSON.stringify(calendarEvent, null, 2));
  
  // Trả về dữ liệu cho node Google Calendar
  return {
    json: calendarEvent
  };
  
} catch (error) {
  console.log("Lỗi xử lý dữ liệu calendar:", error.message);
  throw new Error("Lỗi tạo sự kiện calendar: " + error.message);
} 