const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: true,
        default: 100000
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['momo', 'stripe'],
        default: 'momo'
    },
    transactionId: {
        type: String
    },
    paidAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema); 