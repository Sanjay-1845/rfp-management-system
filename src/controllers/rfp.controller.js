// controllers/rfp.controller.js
const RFP = require('../models/RFP');
const { generateRFPFromText } = require('../services/ai.service');


const Vendor = require('../models/Vendor');
const { sendRFPEmail } = require('../services/email.service');
const { buildRFPEmail } = require('../services/rfpEmailTemplate');

exports.sendRFPToVendors = async (req, res) => {
  try {
    const { rfpId } = req.params;
    const { vendorIds } = req.body;

    const rfp = await RFP.findOne({ rfpId });
    if (!rfp) {
      return res.status(404).json({ error: 'RFP not found' });
    }

    const vendors = await Vendor.find({ vendorId: { $in: vendorIds } });

    const emailHtml = buildRFPEmail(rfp);

    for (const vendor of vendors) {
      console.log("Sending RFP email to vendor: ", vendor.email);
      await sendRFPEmail({
        to: vendor.email,
        subject: `RFP-${rfp.rfpId}: Invitation to Submit Proposal`,
        html: emailHtml
      });
    }

    rfp.status = 'SENT';
    await rfp.save();

    res.json({ message: 'RFP sent to vendors successfully' });
  } catch (err) {
    console.log("Error sending RFP emails: ", err.response?.body);
    res.status(500).json({ error: 'Failed to send RFP emails' });
  }
};


exports.createRFP = async (req, res) => {
  const rfp = await RFP.create(req.body);
  res.status(201).json(rfp);
};

exports.getRFPs = async (req, res) => {
  const rfps = await RFP.find();
  res.json(rfps);
};


// main logic for creating an RFP from text
exports.createRFPFromText = async (req, res) => {
    try {
      const { text } = req.body;
  
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }
  
      const aiResult = await generateRFPFromText(text);
  
      const rfp = await RFP.create({
        title: aiResult.title || 'Untitled RFP',
        rawInput: text,
        structured: aiResult.structured
      });
  
      res.status(201).json(rfp);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate RFP' });
    }
};
