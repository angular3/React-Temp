import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';

// Статистика для дашборда
export const getDashboardStats = async (req, res) => {
  try {
    const [usersCount, productsCount, ordersStats] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
            pending: {
              $sum: {
                $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
              }
            },
            today: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$createdAt',
                      new Date(new Date().setHours(0, 0, 0, 0))
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    const stats = ordersStats[0] || { total: 0, revenue: 0, pending: 0, today: 0 };

    res.json({
      users: usersCount,
      products: productsCount,
      orders: stats.total,
      revenue: stats.revenue,
      pendingOrders: stats.pending,
      todayOrders: stats.today
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Управление пользователями
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      message: 'Пользователь обновлен',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Счетчики для статистики
export const getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const getProductsCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

export const getOrdersStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          },
          today: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$createdAt',
                    new Date(new Date().setHours(0, 0, 0, 0))
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats[0] || { total: 0, revenue: 0, pending: 0, today: 0 };
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};