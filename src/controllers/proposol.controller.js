// controllers/proposal.controller.js
const Proposal = require('../models/Proposal');
const RFP = require('../models/RFP');

exports.createProposal = async (req, res) => {
  const proposal = await Proposal.create(req.body);
  res.status(201).json(proposal);
};

exports.getProposalsByRFP = async (req, res) => {
  const proposals = await Proposal.find({ rfpId: req.params.rfpId })
    .populate('vendorId');
  res.json(proposals);
};

// Get all RFPs that have at least one proposal
exports.getRFPsWithProposals = async (req, res) => {
  try {
    // Get distinct rfpIds from proposals
    const rfpIds = await Proposal.distinct('rfpId');

    // Fetch the RFP documents for those IDs
    const rfps = await RFP.find({ _id: { $in: rfpIds } });

    res.json(rfps);
  } catch (error) {
    console.error('Error fetching RFPs with proposals:', error);
    res.status(500).json({ error: 'Failed to fetch RFPs with proposals' });
  }
};
