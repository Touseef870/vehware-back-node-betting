import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            currentBalance: {
                type: Number,
                required: [true, 'current balance is required']
            },
            isRecieved: {
                type: Boolean,
                default: false
            },
            amount: {
                type: Number,
                required: [true, 'the amount to transact is required']
            },
            message: {
                type: String,
                default: null,
            },
            type: {
                type: String,
                enum: ['credit', 'debit']
            },
            date: {
                type: Date,
                default: Date.now
            },
            historyId: {
                type: String,
                unique: true,
                default: null
            }
        }
    ]
}, { timestamps: true });

const WalletModel = mongoose.model('Wallet', walletSchema);
export default WalletModel;
