import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, Package, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  const statusOptions = {
    pending: { label: 'В ожидании', color: 'bg-yellow-500' },
    confirmed: { label: 'Подтвержден', color: 'bg-blue-500' },
    preparing: { label: 'Готовится', color: 'bg-orange-500' },
    delivering: { label: 'Доставляется', color: 'bg-purple-500' },
    delivered: { label: 'Доставлен', color: 'bg-green-500' },
    cancelled: { label: 'Отменен', color: 'bg-red-500' },
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await apiService.getUserOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      // Заглушка для демонстрации
      setOrders([
        {
          _id: '1',
          items: [
            { product: { name: 'Пицца Маргарита', price: 850 }, quantity: 2, price: 850 },
            { product: { name: 'Кола', price: 150 }, quantity: 1, price: 150 }
          ],
          totalAmount: 1850,
          status: 'delivering',
          deliveryAddress: { street: 'ул. Ленина, 10', city: 'Москва', zipCode: '123456' },
          phone: '+7 999 123-45-67',
          createdAt: new Date().toISOString(),
          notes: 'Позвонить за 10 минут'
        },
        {
          _id: '2',
          items: [
            { product: { name: 'Бургер Классик', price: 450 }, quantity: 1, price: 450 }
          ],
          totalAmount: 450,
          status: 'delivered',
          deliveryAddress: { street: 'пр. Мира, 25', city: 'Москва', zipCode: '654321' },
          phone: '+7 999 123-45-67',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions[status] || { label: status, color: 'bg-gray-500' };
    return (
      <Badge className={`${statusInfo.color} text-white`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">У вас пока нет заказов</h2>
            <p className="text-gray-600 mb-8">
              Сделайте первый заказ из нашего меню
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Перейти к меню
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Заказ #{order._id.slice(-6)}
                      </h3>
                      <p className="text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                      {getStatusBadge(order.status)}
                      <div className="text-xl font-bold text-orange-600">
                        {formatPrice(order.totalAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'товар' : 'товара'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.deliveryAddress.street}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <h4 className="font-medium mb-2">Состав заказа:</h4>
                      <div className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <span key={index}>
                            {item.product.name} × {item.quantity}
                            {index < order.items.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleViewOrder(order)}
                      className="w-full sm:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Диалог с деталями заказа */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Заказ #{selectedOrder?._id.slice(-6)}
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Статус заказа */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Статус заказа:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Информация о заказе */}
                <div>
                  <h3 className="font-semibold mb-2">Информация о заказе</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <div><strong>Дата:</strong> {formatDate(selectedOrder.createdAt)}</div>
                    <div><strong>Телефон:</strong> {selectedOrder.phone}</div>
                    <div>
                      <strong>Адрес доставки:</strong> {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}
                    </div>
                    {selectedOrder.notes && (
                      <div><strong>Комментарий:</strong> {selectedOrder.notes}</div>
                    )}
                  </div>
                </div>

                {/* Состав заказа */}
                <div>
                  <h3 className="font-semibold mb-2">Состав заказа</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
                    <span>Итого:</span>
                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Статус доставки */}
                <div>
                  <h3 className="font-semibold mb-2">Статус доставки</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center space-x-2 ${['pending', 'confirmed', 'preparing', 'delivering', 'delivered'].includes(selectedOrder.status) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${['pending', 'confirmed', 'preparing', 'delivering', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Заказ принят</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${['confirmed', 'preparing', 'delivering', 'delivered'].includes(selectedOrder.status) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${['confirmed', 'preparing', 'delivering', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Заказ подтвержден</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${['preparing', 'delivering', 'delivered'].includes(selectedOrder.status) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${['preparing', 'delivering', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Готовится</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${['delivering', 'delivered'].includes(selectedOrder.status) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${['delivering', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>В пути</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${selectedOrder.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-3 h-3 rounded-full ${selectedOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Доставлен</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Orders;