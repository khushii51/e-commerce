import Product from "../models/Product.js";
import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation.js';

// Create new product
export const createProduct = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : req.body.image;
    const payload = { ...req.body, image };

    const { name, description, price, stock, status } = payload;

    if (stock === 0 || stock === '0') {
      status = 'inactive';
    }

    const product = new Product({ name, description, price, stock, image, status });
    const savedProduct = await product.save();

    return res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
   
    const role = req.user?.role;
    let filter = { isDeleted: { $ne: true } };
    if (role !== 'admin') {
      filter.status = 'active';
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
};

// Get product by id 
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id});
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
};

// Update product 
export const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;
    const image = req.file ? req.file.filename : req.body.image;
    const payload = { ...req.body, image };
 
    const update = {};
    ['name', 'description', 'price', 'stock', 'image', 'status'].forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(payload, f)) update[f] = payload[f];
    });

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }
    
    if (update.stock !== undefined && (update.stock === 0 || update.stock === '0')) {
      update.status = 'inactive';
    }

    const updated = await Product.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: update },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Product updated', product: updated });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
};

// Soft delete product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isDeleted = true;
    product.deletedAt = new Date();
    product.status = 'inactive';
    await product.save();

    res.status(200).json({ message: 'Product soft-deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
};