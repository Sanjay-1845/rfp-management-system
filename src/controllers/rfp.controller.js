// controllers/rfp.controller.js
const RFP = require('../models/RFP');
const { generateRFPFromText } = require('../services/ai.service');

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
