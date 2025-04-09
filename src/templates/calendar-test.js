// Script test để kiểm tra việc tạo sự kiện Google Calendar với múi giờ Việt Nam
// Chạy thử: node calendar-test.js

// Test Input
const testInput = {
  body: {
    bookingId: "test-booking-id-123",
    name: "Nguyễn Văn A",
    email: "test@example.com",
    destination: "Phú Quốc",
    datetime: "2024-04-01T10:00:00",
    message: "Test tour",
    amount: 2
  }
};

// Xử lý múi giờ
function processBooking(data) {
  try {
    const bookingData = data.body;
    const bookingTime = new Date(bookingData.datetime);
    
    if (isNaN(bookingTime.getTime())) {
      console.error("Thời gian không hợp lệ:", bookingData.datetime);
      return null;
    }
    
    // 1. Phương pháp 1: Sử dụng chuỗi ISO với offset +07:00
    const offset = '+07:00';
    const formatDateTime = (date) => {
      return date.toISOString().replace('Z', offset);
    };
    
    const startTime = bookingTime;
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
    
    // 2. Phương pháp 2: Định dạng thủ công
    const pad = (num) => String(num).padStart(2, '0');
    const year = startTime.getFullYear();
    const month = pad(startTime.getMonth() + 1);
    const day = pad(startTime.getDate());
    const hours = pad(startTime.getHours());
    const minutes = pad(startTime.getMinutes());
    
    const endYear = endTime.getFullYear();
    const endMonth = pad(endTime.getMonth() + 1);
    const endDay = pad(endTime.getDate());
    const endHours = pad(endTime.getHours());
    const endMinutes = pad(endTime.getMinutes());
    
    // So sánh các định dạng khác nhau
    console.log("\n=== THỜI GIAN BẮT ĐẦU ===");
    console.log("Original input:", bookingData.datetime);
    console.log("Date object:", startTime);
    console.log("ISO mặc định:", startTime.toISOString());
    console.log("Phương pháp 1 (offset):", formatDateTime(startTime));
    console.log("Phương pháp 2 (thủ công):", `${year}-${month}-${day}T${hours}:${minutes}:00${offset}`);
    
    // Tạo dữ liệu sự kiện calendar
    const calendarEvent = {
      summary: `Tour ${bookingData.destination} - ${bookingData.name}`,
      location: bookingData.destination,
      description: `Booking ID: ${bookingData.bookingId}\nEmail: ${bookingData.email}\nSố lượng: ${bookingData.amount} người\nGhi chú: ${bookingData.message}`,
      
      // Phương pháp 1
      start: {
        dateTime: formatDateTime(startTime),
        timeZone: "Asia/Ho_Chi_Minh"
      },
      end: {
        dateTime: formatDateTime(endTime),
        timeZone: "Asia/Ho_Chi_Minh"
      },
      
      // Các thông tin khác
      reminders: {
        useDefault: true
      },
      attendees: [
        { email: bookingData.email }
      ],
      timeZone: "Asia/Ho_Chi_Minh"
    };
    
    console.log("\n=== DỮ LIỆU CALENDAR ===");
    console.log(JSON.stringify(calendarEvent, null, 2));
    
    return calendarEvent;
  } catch (error) {
    console.error("Lỗi xử lý:", error.message);
    return null;
  }
}

// Chạy test
console.log("=== GOOGLE CALENDAR TEST ===");
const result = processBooking(testInput);

// Hướng dẫn sử dụng trong n8n
console.log("\n=== HƯỚNG DẪN SỬ DỤNG ===");
console.log(`
1. Trong n8n, sử dụng Webhook để nhận dữ liệu đặt tour
2. Sử dụng node Code1 để xử lý dữ liệu và chuyển đổi múi giờ
3. Kết nối node Google Calendar và đảm bảo được cấu hình đúng
4. Lưu ý: API sẽ hiển thị múi giờ mặc định của tài khoản Google
   nhưng sự kiện thực tế sẽ đúng múi giờ Việt Nam
5. Mở Google Calendar để xác minh sự kiện đã được tạo đúng giờ
`); 