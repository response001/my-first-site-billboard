const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password, role } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email and password are required' });
    }
    const exists = await User.findByEmail(email);
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const id = await User.create({ full_name, email, phone: phone || '', password: hash });
    const token = signToken({ id, email, role: role || 'customer' });
    res.status(201).json({ success: true, message: 'Account created', token, user: { id, full_name, email, role: role || 'customer' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ success: true, token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    const admin = await Admin.findByUsername(username);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    const token = signToken({ id: admin.id, email: admin.email, role: 'admin' });
    res.json({ success: true, token, admin: { id: admin.id, username: admin.username, email: admin.email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
