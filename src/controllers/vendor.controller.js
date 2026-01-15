// controllers/vendor.controller.js
const Vendor = require('../models/Vendor');

exports.createVendor = async (req, res) => {
  const vendor = await Vendor.create(req.body);
  res.status(201).json(vendor);
};

exports.getVendors = async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
};
