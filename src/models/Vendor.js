const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const VendorSchema = new mongoose.Schema({
  vendorId: { 
    type: String, 
    unique: true, 
    index: true,
    default: () => uuidv4()
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: String,
  capabilities: [String]
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
