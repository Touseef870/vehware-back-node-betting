import mongoose from 'mongoose';

const depositRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user id is required'],
  },
  amount: {
    type: Number,
    required: [true, 'amount is required'],
    min: [100, 'amount at least 100 or more than 100'],
  },
  transactionId: {
    type: String,
    required: [true, 'transaction id is required'],
    unique: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
}, { timestamps: true });

const DepositRequestModel = mongoose.model('DepositRequest', depositRequestSchema);

export default DepositRequestModel;
