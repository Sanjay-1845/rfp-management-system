const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfp.controller');

router.post('/', rfpController.createRFP);
router.get('/', rfpController.getRFPs);
router.post('/from-text', rfpController.createRFPFromText);

module.exports = router;
