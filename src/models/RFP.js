const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  specifications: mongoose.Schema.Types.Mixed
});

const RFPSchema = new mongoose.Schema({
  rfpId: { 
    type: String, 
    unique: true, 
    index: true,
    default: () => uuidv4()
  },
  title: { type: String, required: true },
  rawInput: { type: String, required: true },

  structured: {
    items: [ItemSchema],
    budget: {
      amount: Number,
      currency: { type: String, default: 'USD' }
    },
    constraints: {
      deliveryDays: Number,
      paymentTerms: String,
      warranty: String
    },
    additionalNotes: String
  }
}, { timestamps: true });

module.exports = mongoose.model('RFP', RFPSchema);
