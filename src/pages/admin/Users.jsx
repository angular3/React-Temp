import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import DataTable from '../../components/admin/DataTable';
import EntityForm from '../../components/admin/EntityForm';
import apiService from '../../services/api';

const userSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  role: z.enum(['user', 'admin']),
});

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('view');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (page = 1, search = '', filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 50,
        ...filterParams
      };
      
      if (search) params.search = search;

      const response = await apiService.request('/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Заглушка для демонстрации
      const mockUsers = [
        {
          _id: '1',
          name: 'Иван Петров',
          email: 'ivan@example.com',
          phone: '+7 999 123-45-67',
          role: 'user',
          createdAt: new Date().toISOString(),
          address: { street: 'ул. Ленина, 10', city: 'Москва', zipCode: '123456' }
        },
        {
          _id: '2',
          name: 'Мария Сидорова',
          email: 'maria@example.com',
          phone: '+7 999 987-65-43',
          role: 'user',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          address: { street: 'пр. Мира, 25', city: 'Москва', zipCode: '654321' }
        },
        {
          _id: '3',
          name: 'Администратор',
          email: 'admin@example.com',
          phone: '+7 999 000-00-00',
          role: 'admin',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          address: { street: 'ул. Админская, 1', city: 'Москва', zipCode: '000000' }
        }
      ];

      setUsers(mockUsers);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: mockUsers.length
      });
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  // Конфигурация колонок таблицы
  const columns = [
    {
      header: 'Имя',
      accessor: 'name'
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Телефон',
      accessor: 'phone'
    },
    {
      header: 'Роль',
      accessor: 'role',
      type: 'badge',
      badgeVariant: (value) => value === 'admin' ? 'destructive' : 'default',
      badgeLabel: (value) => value === 'admin' ? 'Администратор' : 'Пользователь'
    },
    {
      header: 'Дата регистрации',
      accessor: 'createdAt',
      type: 'date'
    }
  ];

  // Конфигурация полей формы
  const formFields = [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      placeholder: 'Имя пользователя',
      fullWidth: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'email@example.com'
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      placeholder: '+7 999 123-45-67'
    },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      placeholder: 'Выберите роль',
      options: [
        { value: 'user', label: 'Пользователь' },
        { value: 'admin', label: 'Администратор' }
      ]
    },
    {
      name: 'address',
      label: 'Адрес',
      type: 'custom',
      fullWidth: true,
      render: (field, isReadonly, value) => (
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
          {selectedUser?.address ? 
            `${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.zipCode}` :
            'Не указан'
          }
        </div>
      )
    },
    {
      name: 'createdAt',
      label: 'Дата регистрации',
      type: 'datetime'
    }
  ];

  // Обработчики событий
  const handleSearch = (query) => {
    setSearchQuery(query);
    loadUsers(1, query, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    loadUsers(1, searchQuery, newFilters);
  };

  const handlePageChange = (page) => {
    loadUsers(page, searchQuery, filters);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data, mode) => {
    setFormLoading(true);
    try {
      if (mode === 'edit') {
        await apiService.request(`/admin/users/${selectedUser._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        toast.success('Пользователь обновлен');
      } else {
        await apiService.request('/admin/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        toast.success('Пользователь создан');
      }

      setIsFormOpen(false);
      loadUsers(pagination.currentPage, searchQuery, filters);
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error);
      toast.error('Ошибка сохранения пользователя');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (user) => {
    try {
      await apiService.request(`/admin/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Пользователь удален');
      setIsFormOpen(false);
      loadUsers(pagination.currentPage, searchQuery, filters);
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      toast.error('Ошибка удаления пользователя');
    }
  };

  return (
    <>
      <DataTable
        title="Управление пользователями"
        data={users}
        columns={columns}
        loading={loading}
        searchFields={['name', 'email', 'phone']}
        filterFields={[
          {
            field: 'role',
            placeholder: 'Все роли',
            options: [
              { value: 'user', label: 'Пользователи' },
              { value: 'admin', label: 'Администраторы' }
            ]
          }
        ]}
        sortFields={['name', 'email', 'createdAt']}
        pagination={pagination}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onPageChange={handlePageChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Пользователи не найдены"
        emptyDescription="Попробуйте изменить параметры поиска"
      />

      <EntityForm
        title="пользователя"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        entity={selectedUser}
        schema={userSchema}
        fields={formFields}
        onSubmit={handleFormSubmit}
        onDelete={handleDelete}
        loading={formLoading}
        deleteConfirmMessage="Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить."
      />
    </>
  );
};

export default Users;