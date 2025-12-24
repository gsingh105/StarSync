import mongoose from 'mongoose';

const callTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    astrologerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Astrologer',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'REFUNDED'],
        default: 'SUCCESS'
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CallTransaction = mongoose.model('CallTransaction', callTransactionSchema);
export default CallTransaction;