const mongoose = require('mongoose');

const connectDB = async (retryCount = 0) => {
    try {
        console.log('🔄 Đang kết nối đến MongoDB...');
        
        // Kiểm tra MONGODB_URI
        if (!process.env.MONGODB_URI) {
            console.warn('⚠️ MONGODB_URI không được cấu hình, sử dụng URI mặc định');
        }
        
        // Options kết nối
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 50,
            minPoolSize: 10,
            maxIdleTimeMS: 10000,
            appName: "HoVietQuy"
        };

        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist-travel',
            options
        );
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Xử lý các sự kiện kết nối
        mongoose.connection.on('connected', () => {
            console.log('🟢 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('🔴 Mongoose connection error:', err);
            // Thử kết nối lại nếu lỗi
            if (retryCount < 3) {
                console.log(`🔄 Đang thử kết nối lại (lần ${retryCount + 1}/3)...`);
                setTimeout(() => connectDB(retryCount + 1), 5000);
            } else {
                console.error('❌ Không thể kết nối đến MongoDB sau 3 lần thử');
                process.exit(1);
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.log('🟡 Mongoose disconnected');
            // Thử kết nối lại khi bị ngắt kết nối
            if (retryCount < 3) {
                console.log(`🔄 Đang thử kết nối lại (lần ${retryCount + 1}/3)...`);
                setTimeout(() => connectDB(retryCount + 1), 5000);
            }
        });

        // Xử lý tắt ứng dụng
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('🔌 Mongoose connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('❌ Error closing Mongoose connection:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // Thử kết nối lại nếu lỗi
        if (retryCount < 3) {
            console.log(`🔄 Đang thử kết nối lại (lần ${retryCount + 1}/3)...`);
            setTimeout(() => connectDB(retryCount + 1), 5000);
        } else {
            console.error('❌ Không thể kết nối đến MongoDB sau 3 lần thử');
            process.exit(1);
        }
    }
};

module.exports = connectDB; 