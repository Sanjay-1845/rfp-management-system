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

exports.updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId },
      req.body,
      { new: true }
    );
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vendor' });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findOneAndDelete({ vendorId });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
};
