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
            amount: Number,
            type: { type: String, enum: ['credit', 'debit'] },
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const WalletModel = mongoose.model('Wallet', walletSchema);
export default WalletModel;
