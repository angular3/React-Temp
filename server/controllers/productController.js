import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    
    let query = { isAvailable: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const getPopularProducts = async (req, res) => {
  try {
    const products = await Product.find({ isPopular: true, isAvailable: true })
      .populate('category', 'name')
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }

    const product = new Product(productData);
    await product.save();

    const populatedProduct = await Product.findById(product._id).populate('category', 'name');
    
    res.status(201).json({
      message: 'Продукт успешно создан',
      product: populatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    res.json({
      message: 'Продукт успешно обновлен',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    res.json({ message: 'Продукт успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};