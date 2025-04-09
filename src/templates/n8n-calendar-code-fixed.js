// Code để xử lý dữ liệu booking và tạo sự kiện Google Calendar với timezone Việt Nam
// Dùng cho node Code1 trong n8n - ĐÃ SỬA LỖI TIÊU ĐỀ VÀ THỜI GIAN

// Lấy dữ liệu từ webhook
const data = items[0].json;

// Log ra để kiểm tra dữ liệu đầu vào chi tiết
console.log("=== WEBHOOK RAW DATA ===");
console.log(JSON.stringify(data, null, 2));

// Xác định nơi chứa dữ liệu chính
let bookingData;
if (data.body && typeof data.body === 'object') {
  bookingData = data.body;
} else if (data.body && typeof data.body === 'string') {
  try {
    bookingData = JSON.parse(data.body);
  } catch (e) {
    console.log("Không thể parse data.body dạng string:", e.message);
    bookingData = data;
  }
} else {
  bookingData = data;
}

console.log("=== BOOKING DATA EXTRACTED ===");
console.log(JSON.stringify(bookingData, null, 2));

// Kiểm tra dữ liệu đầu vào có hợp lệ không
if (!bookingData) {
  console.log("Không có dữ liệu đầu vào hợp lệ");
  return [];
}

// Xử lý dữ liệu cho Google Calendar
try {
  // Kiểm tra và ghi log các trường dữ liệu quan trọng
  console.log("Tiêu đề tour:", bookingData.destination || "Không có");
  console.log("Tên khách hàng:", bookingData.name || "Không có");
  console.log("Thời gian đặt:", bookingData.datetime || "Không có");
  
  // Trích xuất thời gian từ dữ liệu đầu vào
  if (!bookingData.datetime) {
    throw new Error("Thiếu thông tin thời gian đặt tour");
  }
  
  // Xử lý thời gian và chuyển đổi sang múi giờ Việt Nam
  let bookingTime;
  
  // Xử lý nhiều định dạng thời gian có thể có
  try {
    if (typeof bookingData.datetime === 'string') {
      if (bookingData.datetime.includes('T')) {
        // Định dạng ISO: 2024-04-01T10:00:00
        bookingTime = new Date(bookingData.datetime);
      } else if (bookingData.datetime.includes('/')) {
        // Định dạng dd/mm/yyyy hh:mm
        const parts = bookingData.datetime.split(' ');
        const dateParts = parts[0].split('/');
        const timeParts = parts.length > 1 ? parts[1].split(':') : ['0', '0'];
        
        bookingTime = new Date(
          parseInt(dateParts[2]), // năm
          parseInt(dateParts[1]) - 1, // tháng (0-11)
          parseInt(dateParts[0]), // ngày
          parseInt(timeParts[0]), // giờ
          parseInt(timeParts[1]) // phút
        );
      } else {
        // Thử các định dạng khác
        bookingTime = new Date(bookingData.datetime);
      }
    } else if (bookingData.datetime instanceof Date) {
      bookingTime = bookingData.datetime;
    } else {
      throw new Error("Định dạng thời gian không được hỗ trợ");
    }
    
    if (isNaN(bookingTime.getTime())) {
      throw new Error("Thời gian không hợp lệ");
    }
  } catch (err) {
    console.log("Lỗi xử lý thời gian:", err.message);
    console.log("Giá trị thời gian gốc:", bookingData.datetime);
    throw new Error(`Không thể xử lý thời gian đặt tour: ${err.message}`);
  }
  
  // Tạo thời gian bắt đầu và kết thúc cho sự kiện
  // Sử dụng cách định dạng RFC 3339 thay vì cách thay thế 'Z' bằng offset
  const pad = (num) => String(num).padStart(2, '0');
  
  const formatDateTimeRFC3339 = (date) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    // RFC 3339 format với offset +07:00 (Việt Nam)
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
  };
  
  // Thời gian kết thúc (2 giờ sau thời gian bắt đầu)
  const endTime = new Date(bookingTime.getTime() + 2 * 60 * 60 * 1000);
  
  // Tạo object thời gian đúng định dạng
  const startDate = {
    dateTime: formatDateTimeRFC3339(bookingTime),
    timeZone: "Asia/Ho_Chi_Minh"
  };
  
  const endDate = {
    dateTime: formatDateTimeRFC3339(endTime),
    timeZone: "Asia/Ho_Chi_Minh"
  };
  
  console.log("=== THỜI GIAN ĐÃ XỬ LÝ ===");
  console.log("Thời gian bắt đầu:", startDate.dateTime);
  console.log("Thời gian kết thúc:", endDate.dateTime);
  
  // Tạo tiêu đề sự kiện
  const summary = `Tour ${bookingData.destination || "Không xác định"} - ${bookingData.name || "Khách hàng"}`;
  
  // Tạo dữ liệu sự kiện calendar
  const calendarEvent = {
    // Thông tin tour - ĐẢM BẢO SUMMARY KHÔNG BỊ NULL
    summary: summary,
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
  
  console.log("=== GOOGLE CALENDAR EVENT DATA ===");
  console.log(JSON.stringify(calendarEvent, null, 2));
  
  // Trả về dữ liệu cho node Google Calendar
  return {
    json: calendarEvent
  };
  
} catch (error) {
  console.log("❌ LỖI XỬ LÝ DỮ LIỆU CALENDAR:", error.message);
  throw new Error("Lỗi tạo sự kiện calendar: " + error.message);
} 