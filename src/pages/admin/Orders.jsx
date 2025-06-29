import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import DataTable from '../../components/admin/DataTable';
import EntityForm from '../../components/admin/EntityForm';
import { Badge } from '../../components/ui/badge';
import apiService from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('view');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

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

  const loadOrders = async (page = 1, search = '', filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...filterParams
      };
      
      if (search) params.search = search;

      const response = await apiService.request('/orders/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Заглушка для демонстрации
      const mockOrders = [
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
      ];

      setOrders(mockOrders);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: mockOrders.length
      });
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      toast.error('Ошибка загрузки заказов');
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
      
      toast.success('Статус заказа обновлен');
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  // Конфигурация колонок таблицы
  const columns = [
    {
      header: 'ID заказа',
      accessor: '_id',
      render: (value) => `#${value.slice(-6)}`
    },
    {
      header: 'Клиент',
      accessor: 'user',
      render: (value) => (
        <div>
          <div className="font-medium">{value.name}</div>
          <div className="text-sm text-gray-600">{value.email}</div>
        </div>
      )
    },
    {
      header: 'Сумма',
      accessor: 'totalAmount',
      type: 'currency'
    },
    {
      header: 'Статус',
      accessor: 'status',
      type: 'badge',
      badgeVariant: (value) => {
        const status = statusOptions.find(s => s.value === value);
        return status ? 'default' : 'secondary';
      },
      badgeLabel: (value) => {
        const status = statusOptions.find(s => s.value === value);
        return status ? status.label : value;
      }
    },
    {
      header: 'Дата',
      accessor: 'createdAt',
      type: 'datetime'
    }
  ];

  // Конфигурация полей формы для просмотра заказа
  const formFields = [
    {
      name: 'status',
      label: 'Статус заказа',
      type: 'select',
      options: statusOptions,
      fullWidth: true
    },
    {
      name: 'customerName',
      label: 'Имя клиента',
      type: 'text',
      fullWidth: true,
      render: (field, isReadonly, value) => (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          {selectedOrder?.user?.name}
        </div>
      )
    },
    {
      name: 'customerEmail',
      label: 'Email клиента',
      type: 'text',
      render: (field, isReadonly, value) => (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          {selectedOrder?.user?.email}
        </div>
      )
    },
    {
      name: 'customerPhone',
      label: 'Телефон',
      type: 'text',
      render: (field, isReadonly, value) => (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          {selectedOrder?.phone}
        </div>
      )
    },
    {
      name: 'deliveryAddress',
      label: 'Адрес доставки',
      type: 'custom',
      fullWidth: true,
      render: (field, isReadonly, value) => (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          {selectedOrder?.deliveryAddress && 
            `${selectedOrder.deliveryAddress.street}, ${selectedOrder.deliveryAddress.city}, ${selectedOrder.deliveryAddress.zipCode}`
          }
        </div>
      )
    },
    {
      name: 'items',
      label: 'Состав заказа',
      type: 'custom',
      fullWidth: true,
      render: (field, isReadonly, value) => (
        <div className="space-y-2">
          {selectedOrder?.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">{item.product.name}</div>
                <div className="text-sm text-gray-600">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0,
                  }).format(item.price)} × {item.quantity}
                </div>
              </div>
              <div className="font-medium">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0,
                }).format(item.price * item.quantity)}
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 border-t font-bold text-lg">
            <span>Итого:</span>
            <span>
              {new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
              }).format(selectedOrder?.totalAmount || 0)}
            </span>
          </div>
        </div>
      )
    },
    {
      name: 'createdAt',
      label: 'Дата заказа',
      type: 'datetime'
    }
  ];

  // Обработчики событий
  const handleSearch = (query) => {
    setSearchQuery(query);
    loadOrders(1, query, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    loadOrders(1, searchQuery, newFilters);
  };

  const handlePageChange = (page) => {
    loadOrders(page, searchQuery, filters);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data, mode) => {
    if (mode === 'edit' && data.status !== selectedOrder.status) {
      await updateOrderStatus(selectedOrder._id, data.status);
      setSelectedOrder({ ...selectedOrder, status: data.status });
    }
    setIsFormOpen(false);
  };

  // Кастомное действие для быстрого изменения статуса
  const customActions = statusOptions.map(status => ({
    icon: <Badge className={`${status.color} text-white text-xs`}>{status.label}</Badge>,
    title: `Изменить статус на "${status.label}"`,
    onClick: (order) => updateOrderStatus(order._id, status.value),
    variant: 'ghost',
    className: 'p-1 h-auto'
  }));

  return (
    <>
      <DataTable
        title="Управление заказами"
        data={orders}
        columns={columns}
        loading={loading}
        searchFields={['user.name', 'user.email', '_id']}
        filterFields={[
          {
            field: 'status',
            placeholder: 'Все статусы',
            options: statusOptions
          }
        ]}
        sortFields={['createdAt', 'totalAmount']}
        pagination={pagination}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onPageChange={handlePageChange}
        onView={handleView}
        onEdit={handleEdit}
        customActions={customActions}
        emptyMessage="Заказы не найдены"
        emptyDescription="Попробуйте изменить параметры поиска"
      />

      <EntityForm
        title="заказ"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        entity={selectedOrder}
        fields={formFields}
        onSubmit={handleFormSubmit}
        deleteConfirmMessage="Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить."
      />
    </>
  );
};

export default Orders;