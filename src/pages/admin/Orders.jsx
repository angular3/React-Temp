import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from 'sonner';
import apiService from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'В ожидании', color: 'bg-yellow-500' },
    { value: 'confirmed', label: 'Подтвержден', color: 'bg-blue-500' },
    { value: 'preparing', label: 'Готовится', color: 'bg-orange-500' },
    { value: 'delivering', label: 'Доставляется', color: 'bg-purple-500' },
    { value: 'delivered', label: 'Доставлен', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Отменен', color: 'bg-red-500' },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await apiService.request('/orders/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      toast.error('Ошибка загрузки заказов');
      // Заглушка для демонстрации
      setOrders([
        {
          _id: '1',
          user: { name: 'Иван Петров', email: 'ivan@example.com', phone: '+7 999 123-45-67' },
          items: [
            { product: { name: 'Пицца Маргарита', price: 850 }, quantity: 2, price: 850 },
            { product: { name: 'Кола', price: 150 }, quantity: 1, price: 150 }
          ],
          totalAmount: 1850,
          status: 'pending',
          deliveryAddress: { street: 'ул. Ленина, 10', city: 'Москва', zipCode: '123456' },
          phone: '+7 999 123-45-67',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          user: { name: 'Мария Сидорова', email: 'maria@example.com', phone: '+7 999 987-65-43' },
          items: [
            { product: { name: 'Бургер Классик', price: 450 }, quantity: 1, price: 450 }
          ],
          totalAmount: 450,
          status: 'confirmed',
          deliveryAddress: { street: 'пр. Мира, 25', city: 'Москва', zipCode: '654321' },
          phone: '+7 999 987-65-43',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiService.request(`/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast.success('Статус заказа обновлен');
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <Badge className={`${statusOption?.color || 'bg-gray-500'} text-white`}>
        {statusOption?.label || status}
      </Badge>
    );
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Управление заказами</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Просматривайте и управляйте заказами клиентов
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск по имени, email или ID заказа..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все статусы</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Заказы ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse flex space-x-4 p-4">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.user.name}</div>
                        <div className="text-sm text-gray-600">{order.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Заказы не найдены</h3>
              <p className="text-gray-600">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Заказ #{selectedOrder?._id.slice(-6)}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div>
                <label className="text-sm font-medium">Статус заказа</label>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(newStatus) => updateOrderStatus(selectedOrder._id, newStatus)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Информация о клиенте</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div><strong>Имя:</strong> {selectedOrder.user.name}</div>
                  <div><strong>Email:</strong> {selectedOrder.user.email}</div>
                  <div><strong>Телефон:</strong> {selectedOrder.phone}</div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold mb-2">Адрес доставки</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}
                </div>
              </div>

              {/* Order Items */}
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

              {/* Order Date */}
              <div>
                <h3 className="font-semibold mb-2">Дата заказа</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  {formatDate(selectedOrder.createdAt)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;