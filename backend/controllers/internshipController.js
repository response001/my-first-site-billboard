const Internship = require('../models/Internship');

exports.apply = async (req, res) => {
  try {
    const { full_name, school, level, email, phone } = req.body;
    if (!full_name || !email || !level) {
      return res.status(400).json({ success: false, message: 'Full name, email and level are required' });
    }
    const files = req.files || {};
    const cv = files.cv ? `/uploads/${files.cv[0].filename}` : null;
    const rec = files.recommendation ? `/uploads/${files.recommendation[0].filename}` : null;
    const id = await Internship.create({ full_name, school, level, email, phone, cv_file: cv, recommendation_file: rec });
    res.status(201).json({ success: true, message: 'Internship application submitted', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const applications = await Internship.all();
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await Internship.updateStatus(req.params.id, status);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
