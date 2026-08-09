const { Course, CourseRegistration } = require('../models/Course');
const { notifyCourseRegistration } = require('../services/notifier');

exports.list = async (req, res) => {
  try {
    const courses = await Course.all();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.detail = async (req, res) => {
  try {
    const course = await Course.bySlug(req.params.slug);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, duration, description, topics, fee } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = await Course.create({ name, slug, duration, description, topics, fee, image: req.file ? `/uploads/${req.file.filename}` : null });
    res.status(201).json({ success: true, message: 'Course created', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, course_id, education_level } = req.body;
    if (!full_name || !email || !course_id) {
      return res.status(400).json({ success: false, message: 'Full name, email and course are required' });
    }
    const course = await Course.byId(course_id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const id = await CourseRegistration.create({ full_name, email, phone, course_id, course_name: course.name, education_level });
    notifyCourseRegistration({ full_name, email, phone, course_id, course_name: course.name, education_level }, id)
      .catch((err) => console.error('[notify] Course registration notification error:', err.message));
    res.status(201).json({ success: true, message: 'Registration submitted', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.registrations = async (req, res) => {
  try {
    const registrations = await CourseRegistration.all();
    res.json({ success: true, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await CourseRegistration.updateStatus(req.params.id, status);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
