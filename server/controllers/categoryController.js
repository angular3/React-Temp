import Category from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    
    if (req.file) {
      categoryData.image = `/uploads/${req.file.filename}`;
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      message: 'Категория успешно создана',
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    
    if (req.file) {
      categoryData.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    res.json({
      message: 'Категория успешно обновлена',
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    res.json({ message: 'Категория успешно удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};