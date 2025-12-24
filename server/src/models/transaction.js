import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    },
    paymentId: {
        type: String
    },
    description: {
        type: String
    },
    createdAt: { type: Date, default: Date.now }
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);
export default TransactionModel