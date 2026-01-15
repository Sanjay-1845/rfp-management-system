const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  rfpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFP',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  rawEmail: { type: String, required: true },

  extractedData: {
    pricing: {
      totalAmount: Number,
      currency: { type: String, default: 'USD' }
    },
    deliveryDays: Number,
    warranty: String,
    paymentTerms: String
  },

  aiSummary: String,
  aiScore: Number
}, { timestamps: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
