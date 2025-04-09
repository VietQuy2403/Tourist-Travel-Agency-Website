// Template email hủy tour cho n8n
// Sao chép toàn bộ nội dung này và dán vào node "Set" hoặc "Template" trong n8n

// Đoạn code để trả về template HTML email
const body = $json;

return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông Báo Hủy Tour</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #ff5e5e;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
            color: white;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .info-box {
            background-color: #f9f9f9;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #ff5e5e;
            border-radius: 3px;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            margin: 20px 0;
            text-decoration: none;
            border-radius: 4px;
        }
        .important-note {
            background-color: #fff8e1;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #ffc107;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thông Báo Hủy Tour</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>${body.name || 'Quý khách'}</strong>,</p>
            
            <p>Chúng tôi xin thông báo rằng yêu cầu hủy tour của bạn đã được xử lý thành công.</p>
            
            <div class="info-box">
                <div class="info-item">
                    <span class="info-label">Điểm đến:</span> 
                    <span>${body.destination || 'Không xác định'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Thời gian dự kiến:</span> 
                    <span>${body.emailData?.templateData?.datetime || 'Không có thông tin'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Mã đặt tour:</span> 
                    <span>${body.bookingId || 'Không xác định'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Thời gian hủy:</span> 
                    <span>${body.emailData?.templateData?.cancelledAt || 'Không có thông tin'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Lý do hủy:</span> 
                    <span>${body.emailData?.templateData?.cancelReason || 'Không có lý do'}</span>
                </div>
            </div>
            
            <div class="important-note">
                <h3>Thông tin quan trọng:</h3>
                <ul>
                    <li>Nếu bạn đã thanh toán, khoản tiền sẽ được hoàn trả trong vòng 7 ngày làm việc.</li>
                    <li>Bạn có thể đặt lại tour vào thời gian khác trên website của chúng tôi.</li>
                    <li>Mọi thắc mắc vui lòng liên hệ qua hotline: <strong>1900 1234</strong>.</li>
                </ul>
            </div>
            
            <p>Chúng tôi chân thành xin lỗi vì sự bất tiện này và mong được phục vụ bạn trong các tour du lịch khác.</p>
            
            <center>
                <a href="http://localhost:3000/packages" class="button">Xem Các Tour Khác</a>
            </center>
            
            <p>Trân trọng,<br>
            <strong>Tourist Travel Agency</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Tourist Travel Agency. Tất cả quyền được bảo lưu.</p>
            <p>Địa chỉ: 123 Đường Du Lịch, Phường Du Khách, Thành phố Du Lịch</p>
            <img src="http://localhost:5000/api/track-email-open/by-email/${body.email || ''}?type=cancellation" width="1" height="1" alt="" />
        </div>
    </div>
</body>
</html>`; 