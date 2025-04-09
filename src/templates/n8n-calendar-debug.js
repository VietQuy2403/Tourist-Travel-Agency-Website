// Code gỡ lỗi cho Google Calendar trong n8n
// Chú ý: Đặt một node Debug sau Code1 để xem dữ liệu thực tế

// Lấy dữ liệu từ webhook
const data = items[0].json;

// Kiểm tra dữ liệu nhận được
console.log("=== STEP 1: DATA FROM WEBHOOK ===");
console.log(JSON.stringify(data, null, 2));

// Để debug, tạo một bản sao độc lập của dữ liệu
const originalRequest = JSON.parse(JSON.stringify(data));

// Trích xuất booking data
let bookingData;
if (data.body && typeof data.body === 'object') {
  bookingData = data.body;
} else if (data.body && typeof data.body === 'string') {
  try {
    bookingData = JSON.parse(data.body);
  } catch (e) {
    bookingData = data;
  }
} else {
  bookingData = data;
}

console.log("=== STEP 2: BOOKING DATA EXTRACTED ===");
console.log(JSON.stringify(bookingData, null, 2));

// THỜI GIAN TEST - Đặt trực tiếp thay vì đọc từ input 
// Bỏ comment dòng này để test với dữ liệu cứng
// bookingData.datetime = "2025-03-30T14:00:00";

// Thông tin đặt tour
const destination = bookingData.destination || "Đà Lạt";
const customerName = bookingData.name || "Khách hàng";
const bookingId = bookingData.bookingId || "test-id";
const customerEmail = bookingData.email || "test@example.com";
const customerNote = bookingData.message || "Không có ghi chú";
const passengerCount = bookingData.amount || 1;

console.log("=== STEP 3: TOUR DETAILS ===");
console.log("Điểm đến:", destination);
console.log("Tên khách hàng:", customerName);
console.log("Thời gian tour:", bookingData.datetime);

// Xử lý datetime
let tourDate, tourDateEnd;
try {
  // Xử lý trường hợp datetime null hoặc undefined
  if (!bookingData.datetime) {
    throw new Error("Không có thông tin thời gian tour");
  }
  
  // Chuyển đổi datetime sang đối tượng Date
  tourDate = new Date(bookingData.datetime);
  
  // Kiểm tra xem Date có hợp lệ không
  if (isNaN(tourDate.getTime())) {
    throw new Error(`Định dạng thời gian không hợp lệ: ${bookingData.datetime}`);
  }
  
  // Tính thời gian kết thúc (2 giờ sau thời gian bắt đầu)
  tourDateEnd = new Date(tourDate.getTime() + 2 * 60 * 60 * 1000);
  
  console.log("=== STEP 4: DATE CONVERSION ===");
  console.log("Datetime gốc:", bookingData.datetime);
  console.log("Date object (start):", tourDate);
  console.log("Date object (end):", tourDateEnd);
  console.log("ISO string (start):", tourDate.toISOString());
  console.log("ISO string (end):", tourDateEnd.toISOString());

} catch (error) {
  console.error("=== ERROR: DATE PROCESSING ===");
  console.error(error.message);
  
  // Sử dụng thời gian mặc định nếu có lỗi
  tourDate = new Date();
  tourDate.setHours(tourDate.getHours() + 24); // Đặt thời gian là 24 giờ sau
  tourDateEnd = new Date(tourDate.getTime() + 2 * 60 * 60 * 1000);
  
  console.log("Sử dụng thời gian mặc định:", tourDate);
}

// QUAN TRỌNG: Định dạng lại thời gian sử dụng RFC 3339 với offset Việt Nam
function formatToRFC3339(date) {
  const pad = (num) => String(num).padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
}

// Tạo đối tượng Google Calendar cho thời gian bắt đầu và kết thúc
const formattedStart = {
  dateTime: formatToRFC3339(tourDate),
  timeZone: "Asia/Ho_Chi_Minh"
};

const formattedEnd = {
  dateTime: formatToRFC3339(tourDateEnd),
  timeZone: "Asia/Ho_Chi_Minh"
};

console.log("=== STEP 5: FORMATTED DATES (RFC 3339) ===");
console.log("Start datetime:", formattedStart.dateTime);
console.log("End datetime:", formattedEnd.dateTime);

// Tạo đối tượng sự kiện Google Calendar
const calendarEvent = {
  summary: `Tour ${destination} - ${customerName}`,
  location: destination,
  description: `Booking ID: ${bookingId}\nEmail: ${customerEmail}\nSố lượng: ${passengerCount} người\nGhi chú: ${customerNote}`,
  start: formattedStart,
  end: formattedEnd,
  timeZone: "Asia/Ho_Chi_Minh",
  reminders: {
    useDefault: true
  },
  attendees: [
    {
      email: customerEmail
    }
  ]
};

console.log("=== FINAL: CALENDAR EVENT DATA ===");
console.log(JSON.stringify(calendarEvent, null, 2));

// TRẢ VỀ ĐỐI TƯỢNG HOÀN CHỈNH để chuyển cho Google Calendar node
return {
  json: calendarEvent
}; 