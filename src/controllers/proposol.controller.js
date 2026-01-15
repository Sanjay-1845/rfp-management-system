// controllers/proposal.controller.js
const Proposal = require('../models/Proposal');

exports.createProposal = async (req, res) => {
  const proposal = await Proposal.create(req.body);
  res.status(201).json(proposal);
};

exports.getProposalsByRFP = async (req, res) => {
  const proposals = await Proposal.find({ rfpId: req.params.rfpId })
    .populate('vendorId');
  res.json(proposals);
};
