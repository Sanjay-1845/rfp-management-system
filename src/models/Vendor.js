const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: String,
  capabilities: [String]
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
