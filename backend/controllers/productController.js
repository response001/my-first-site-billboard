const Product = require('../models/Product');
const Category = require('../models/Category');

function normalize(v) {
  if (v == null || Array.isArray(v)) return v;
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : v;
  } catch {
    return v;
  }
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

exports.list = async (req, res) => {
  try {
    const { category } = req.query;
    let products;
    if (category) {
      const cat = await Category.bySlug(category);
      if (!cat) return res.json({ success: true, products: [] });
      products = await Product.byCategory(cat.id);
    } else {
      products = await Product.all();
    }
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.featured = async (req, res) => {
  try {
    const products = await Product.featured();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.categories = async (req, res) => {
  try {
    const categories = await Category.all();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.detail = async (req, res) => {
  try {
    const product = await Product.bySlug(req.params.slug);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, category_id, description, price, quantity, featured, gallery, features } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }
    const id = await Product.create({
      category_id,
      name,
      slug: slugify(name),
      description,
      price,
      quantity,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      gallery: normalize(gallery),
      features: normalize(features),
      featured,
    });
    res.status(201).json({ success: true, message: 'Product created', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.byId(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const fields = { ...req.body };
    if (fields.name) fields.slug = slugify(fields.name);
    if (req.file) fields.image = `/uploads/${req.file.filename}`;
    await Product.update(req.params.id, fields);
    res.json({ success: true, message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Product.remove(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const id = await Category.create({ name, slug: slugify(name), description });
    res.status(201).json({ success: true, message: 'Category created', id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    await Category.remove(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
