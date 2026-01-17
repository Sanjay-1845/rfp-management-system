const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const Proposal = require('../models/Proposal');
const { extractProposalFromEmail } = require('../services/ai');

exports.handleInboundEmail = async (req, res) => {
  try {
    const { from, subject, text } = req.body;

    // 1. Extract RFP ID from subject
    console.log("Subject passed in mail is : ", subject);
    const match = subject && subject.match(/RFP-[\w-]+/);
    if (!match) {
      return res.status(400).send('RFP ID not found in subject');
    }
    const rfpId = match[0].replace('RFP-', '');

    // 2. Find RFP
    const rfp = await RFP.findOne({ rfpId });
    if (!rfp) {
      return res.status(404).send('RFP not found');
    }

    // 3. Find or create vendor
    let vendor = await Vendor.findOne({ email: from });
    if (!vendor) {
      vendor = await Vendor.create({
        name: from.split('@')[0],
        email: from
      });
    }

    // 4. AI extraction
    const aiResult = await extractProposalFromEmail({
      rfp,
      emailText: text || html
    });

    // 5. Save proposal
    await Proposal.create({
      rfpId: rfp._id,
      vendorId: vendor._id,
      rawEmail: text || html,
      extractedData: aiResult.extractedData,
      aiSummary: aiResult.summary,
      aiScore: aiResult.score
    });

    res.status(200).send('Inbound email processed');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing inbound email');
  }
};
