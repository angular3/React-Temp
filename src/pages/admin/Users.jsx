import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import apiService from '../../services/api';

const userSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  role: z.enum(['user', 'admin']),
});

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'user',
    },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiService.request('/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(response.users || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      toast.error('Ошибка загрузки пользователей');
      // Заглушка для демонстрации
      setUsers([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await apiService.request(`/admin/users/${editingUser._id}`, {
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

      setIsEditDialogOpen(false);
      setEditingUser(null);
      form.reset();
      loadUsers();
    } catch (error) {
      console.error('Ошибка сохранения пользователя:', error);
      toast.error('Ошибка сохранения пользователя');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    try {
      await apiService.request(`/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Пользователь удален');
      loadUsers();
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      toast.error('Ошибка удаления пользователя');
    }
  };

  const getRoleBadge = (role) => {
    return (
      <Badge variant={role === 'admin' ? 'destructive' : 'default'}>
        {role === 'admin' ? 'Администратор' : 'Пользователь'}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Управление пользователями</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Просматривайте и управляйте пользователями системы
          </p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingUser(null);
              form.reset();
            }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input placeholder="Имя пользователя" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <Input placeholder="+7 999 123-45-67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Роль</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите роль" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">Пользователь</SelectItem>
                          <SelectItem value="admin">Администратор</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingUser ? 'Обновить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск по имени, email или телефону..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все роли</SelectItem>
                  <SelectItem value="user">Пользователи</SelectItem>
                  <SelectItem value="admin">Администраторы</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Пользователи ({filteredUsers.length})</CardTitle>
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
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Пользователи не найдены</h3>
              <p className="text-gray-600">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Информация о пользователе</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Имя</label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {selectedUser.name}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {selectedUser.email}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Телефон</label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {selectedUser.phone}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Роль</label>
                <div className="mt-1">
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>
              {selectedUser.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Адрес</label>
                  <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.zipCode}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Дата регистрации</label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  {formatDate(selectedUser.createdAt)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;