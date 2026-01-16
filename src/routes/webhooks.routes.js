const express = require('express');
const router = express.Router();
const inboundController = require('../controllers/inboundEmail.controller');

router.post(
  '/sendgrid/inbound',
  inboundController.handleInboundEmail
);

module.exports = router;
