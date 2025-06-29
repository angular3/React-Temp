import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import DataTable from '../../components/admin/DataTable';
import EntityForm from '../../components/admin/EntityForm';
import apiService from '../../services/api';

const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('view');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (search = '') => {
    setLoading(true);
    try {
      const categoriesData = await apiService.getCategories();
      let filteredCategories = categoriesData;
      
      if (search) {
        filteredCategories = categoriesData.filter(category =>
          category.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      toast.error('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  // Конфигурация колонок таблицы
  const columns = [
    {
      header: 'Название',
      accessor: 'name'
    },
    {
      header: 'Описание',
      accessor: 'description',
      render: (value) => value || 'Не указано'
    },
    {
      header: 'Статус',
      accessor: 'isActive',
      type: 'badge',
      badgeVariant: (value) => value ? 'default' : 'secondary',
      badgeLabel: (value) => value ? 'Активна' : 'Неактивна'
    },
    {
      header: 'Дата создания',
      accessor: 'createdAt',
      type: 'date'
    }
  ];

  // Конфигурация полей формы
  const formFields = [
    {
      name: 'name',
      label: 'Название',
      type: 'text',
      placeholder: 'Название категории',
      fullWidth: true
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
      placeholder: 'Описание категории',
      fullWidth: true,
      rows: 3
    },
    {
      name: 'isActive',
      label: 'Активная категория',
      type: 'boolean',
      defaultValue: true
    }
  ];

  // Обработчики событий
  const handleSearch = (query) => {
    setSearchQuery(query);
    loadCategories(query);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data, mode) => {
    setFormLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      if (mode === 'edit') {
        await apiService.request(`/categories/${selectedCategory._id}`, {
          method: 'PUT',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Категория обновлена');
      } else {
        await apiService.request('/categories', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Категория создана');
      }

      setIsFormOpen(false);
      loadCategories(searchQuery);
    } catch (error) {
      console.error('Ошибка сохранения категории:', error);
      toast.error('Ошибка сохранения категории');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (category) => {
    try {
      await apiService.request(`/categories/${category._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Категория удалена');
      setIsFormOpen(false);
      loadCategories(searchQuery);
    } catch (error) {
      console.error('Ошибка удаления категории:', error);
      toast.error('Ошибка удаления категории');
    }
  };

  return (
    <>
      <DataTable
        title="Управление категориями"
        data={categories}
        columns={columns}
        loading={loading}
        searchFields={['name']}
        filterFields={[
          {
            field: 'isActive',
            placeholder: 'Статус',
            options: [
              { value: 'true', label: 'Активные' },
              { value: 'false', label: 'Неактивные' }
            ]
          }
        ]}
        sortFields={['name', 'createdAt']}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Категории не найдены"
        emptyDescription="Попробуйте изменить параметры поиска или добавьте новую категорию"
      />

      <EntityForm
        title="категорию"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        entity={selectedCategory}
        schema={categorySchema}
        fields={formFields}
        onSubmit={handleFormSubmit}
        onDelete={handleDelete}
        loading={formLoading}
        deleteConfirmMessage="Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить."
      />
    </>
  );
};

export default Categories;