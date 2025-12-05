const MatchModel = require('../models/match');

module.exports = async (req, res) => {
  const userId = req.body.uid;
  
  try {
    const match = await MatchModel.create(userId);
    return res.json({ success: true, data: match });
  } catch (e) {
    console.error('Error creating match:', e);
    return res.status(400).json({ success: false, message: e.message });
  }
};