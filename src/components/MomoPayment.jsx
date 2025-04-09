import React from 'react';
import { MOMO_CONFIG } from '../config/momoConfig';
import crypto from 'crypto';

const MomoPayment = ({ amount, orderId, onSuccess }) => {
    const createSignature = (data) => {
        const signature = crypto
            .createHmac('sha256', MOMO_CONFIG.secretKey)
            .update(data)
            .digest('hex');
        return signature;
    };

    const handlePayment = async () => {
        try {
            const orderInfo = `${MOMO_CONFIG.orderInfo} - ${orderId}`;
            const requestId = Date.now().toString();
            const extraData = "";

            const rawSignature = `accessKey=${MOMO_CONFIG.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${MOMO_CONFIG.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.partnerCode}&redirectUrl=${MOMO_CONFIG.redirectUrl}&requestId=${requestId}&requestType=${MOMO_CONFIG.requestType}`;
            const signature = createSignature(rawSignature);

            const requestBody = {
                partnerCode: MOMO_CONFIG.partnerCode,
                partnerName: "Travel Agency",
                storeId: "TravelAgency",
                requestId: requestId,
                amount: amount,
                orderId: orderId,
                orderInfo: orderInfo,
                redirectUrl: MOMO_CONFIG.redirectUrl,
                ipnUrl: MOMO_CONFIG.ipnUrl,
                lang: MOMO_CONFIG.lang,
                extraData: extraData,
                requestType: MOMO_CONFIG.requestType,
                signature: signature
            };

            const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            
            if (data.payUrl) {
                window.location.href = data.payUrl;
            } else {
                throw new Error('Không thể tạo URL thanh toán');
            }
        } catch (error) {
            console.error('Lỗi thanh toán:', error);
            alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.');
        }
    };

    return (
        <div className="momo-payment">
            <button 
                onClick={handlePayment}
                className="btn btn-primary w-100 py-3"
            >
                Thanh toán qua Momo
            </button>
        </div>
    );
};

export default MomoPayment; 