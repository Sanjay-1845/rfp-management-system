const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposol.controller');

router.get('/rfps-with-proposals', proposalController.getRFPsWithProposals);
router.get('/rfp/:rfpId', proposalController.getProposalsByRFP);

module.exports = router;
