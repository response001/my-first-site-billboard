const { Message, BlogPost } = require('../models/Message');
const { notifyContactMessage } = require('../services/notifier');

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const id = await Message.create({ name, email, subject, message });
    notifyContactMessage({ name, email, subject, message }, id)
      .catch((err) => console.error('[notify] Contact message notification error:', err.message));
    res.status(201).json({ success: true, message: 'Message sent successfully', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.messages = async (req, res) => {
  try {
    const messages = await Message.all();
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Message.markRead(req.params.id);
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.listBlog = async (req, res) => {
  try {
    const posts = await BlogPost.all();
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.blogDetail = async (req, res) => {
  try {
    const post = await BlogPost.bySlug(req.params.slug);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, author } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = await BlogPost.create({ title, slug, excerpt, content, category, image: req.file ? `/uploads/${req.file.filename}` : null, author });
    res.status(201).json({ success: true, message: 'Post created', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
