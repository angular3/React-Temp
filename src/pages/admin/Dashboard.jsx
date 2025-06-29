import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Package, ShoppingCart, TrendingUp, DollarSign, Clock } from 'lucide-react';
import apiService from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // В реальном приложении здесь будут отдельные API endpoints для статистики
      const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
        apiService.request('/admin/users/count'),
        apiService.request('/admin/products/count'),
        apiService.request('/admin/orders/stats')
      ]);

      setStats({
        totalUsers: usersResponse.count || 0,
        totalProducts: productsResponse.count || 0,
        totalOrders: ordersResponse.total || 0,
        totalRevenue: ordersResponse.revenue || 0,
        pendingOrders: ordersResponse.pending || 0,
        todayOrders: ordersResponse.today || 0
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      // Заглушка для демонстрации
      setStats({
        totalUsers: 1250,
        totalProducts: 85,
        totalOrders: 3420,
        totalRevenue: 2850000,
        pendingOrders: 12,
        todayOrders: 45
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'Всего пользователей',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Товаров в каталоге',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Всего заказов',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Общая выручка',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Заказы в обработке',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Заказов сегодня',
      value: stats.todayOrders,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Обзор основных показателей вашего ресторана
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} dark:bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Заказ #{1000 + index}</p>
                    <p className="text-sm text-gray-600">Клиент {index + 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(1500 + index * 200)}</p>
                    <p className="text-sm text-orange-600">В обработке</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные блюда</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Пицца Маргарита', 'Бургер Классик', 'Паста Карбонара', 'Салат Цезарь', 'Суп Том Ям'].map((dish, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{dish}</p>
                    <p className="text-sm text-gray-600">{50 - index * 5} заказов</p>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${100 - index * 15}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;