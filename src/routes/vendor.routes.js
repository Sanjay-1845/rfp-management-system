const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');

router.post('/', vendorController.createVendor);
router.get('/', vendorController.getVendors);
router.put('/:vendorId', vendorController.updateVendor);
router.delete('/:vendorId', vendorController.deleteVendor);

module.exports = router;