import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import DataTable from '../../components/admin/DataTable';
import EntityForm from '../../components/admin/EntityForm';
import apiService from '../../services/api';

const productSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().min(1, 'Описание обязательно'),
  price: z.number().min(0, 'Цена должна быть положительной'),
  category: z.string().min(1, 'Категория обязательна'),
  weight: z.number().min(0, 'Вес должен быть положительным'),
  calories: z.number().min(0, 'Калории должны быть положительными').optional(),
  ingredients: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('view');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async (page = 1, search = '', filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...filterParams
      };
      
      if (search) params.search = search;

      const response = await apiService.getProducts(params);
      setProducts(response.products || []);
      setPagination({
        currentPage: response.currentPage || page,
        totalPages: response.totalPages || 1,
        total: response.total || 0
      });
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      toast.error('Ошибка загрузки продуктов');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  // Конфигурация колонок таблицы
  const columns = [
    {
      header: 'Изображение',
      accessor: 'image',
      render: (value) => (
        <img
          src={value || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt="Product"
          className="w-12 h-12 object-cover rounded"
        />
      )
    },
    {
      header: 'Название',
      accessor: 'name'
    },
    {
      header: 'Категория',
      accessor: 'category',
      render: (value) => value?.name || 'Не указана'
    },
    {
      header: 'Цена',
      accessor: 'price',
      type: 'currency'
    },
    {
      header: 'Вес',
      accessor: 'weight',
      render: (value) => `${value}г`
    },
    {
      header: 'Доступность',
      accessor: 'isAvailable',
      type: 'badge',
      badgeVariant: (value) => value ? 'default' : 'secondary',
      badgeLabel: (value) => value ? 'Доступен' : 'Недоступен'
    },
    {
      header: 'Популярное',
      accessor: 'isPopular',
      type: 'badge',
      badgeVariant: (value) => value ? 'default' : 'outline',
      badgeLabel: (value) => value ? 'Да' : 'Нет'
    }
  ];

  // Конфигурация полей формы
  const formFields = [
    {
      name: 'name',
      label: 'Название',
      type: 'text',
      placeholder: 'Название блюда',
      fullWidth: true
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
      placeholder: 'Описание блюда',
      fullWidth: true,
      rows: 3
    },
    {
      name: 'category',
      label: 'Категория',
      type: 'select',
      placeholder: 'Выберите категорию',
      options: categories.map(cat => ({ value: cat._id, label: cat.name }))
    },
    {
      name: 'price',
      label: 'Цена (₽)',
      type: 'number',
      placeholder: '0'
    },
    {
      name: 'weight',
      label: 'Вес (г)',
      type: 'number',
      placeholder: '0'
    },
    {
      name: 'calories',
      label: 'Калории',
      type: 'number',
      placeholder: '0'
    },
    {
      name: 'ingredients',
      label: 'Ингредиенты',
      type: 'array',
      placeholder: 'Помидоры, сыр, базилик...',
      fullWidth: true,
      description: 'Введите ингредиенты через запятую'
    },
    {
      name: 'isAvailable',
      label: 'Доступно для заказа',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'isPopular',
      label: 'Популярное блюдо',
      type: 'boolean',
      defaultValue: false
    }
  ];

  // Обработчики событий
  const handleSearch = (query) => {
    setSearchQuery(query);
    loadProducts(1, query, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    loadProducts(1, searchQuery, newFilters);
  };

  const handlePageChange = (page) => {
    loadProducts(page, searchQuery, filters);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data, mode) => {
    setFormLoading(true);
    try {
      const formData = new FormData();
      
      // Преобразуем ingredients из строки в массив
      const ingredients = data.ingredients ? 
        (Array.isArray(data.ingredients) ? data.ingredients : data.ingredients.split(',').map(i => i.trim())) : 
        [];
      
      Object.keys(data).forEach(key => {
        if (key === 'ingredients') {
          formData.append(key, JSON.stringify(ingredients));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (mode === 'edit') {
        await apiService.request(`/products/${selectedProduct._id}`, {
          method: 'PUT',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Продукт обновлен');
      } else {
        await apiService.request('/products', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Продукт создан');
      }

      setIsFormOpen(false);
      loadProducts(pagination.currentPage, searchQuery, filters);
    } catch (error) {
      console.error('Ошибка сохранения продукта:', error);
      toast.error('Ошибка сохранения продукта');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (product) => {
    try {
      await apiService.request(`/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Продукт удален');
      setIsFormOpen(false);
      loadProducts(pagination.currentPage, searchQuery, filters);
    } catch (error) {
      console.error('Ошибка удаления продукта:', error);
      toast.error('Ошибка удаления продукта');
    }
  };

  return (
    <>
      <DataTable
        title="Управление продуктами"
        data={products}
        columns={columns}
        loading={loading}
        searchFields={['name', 'description']}
        filterFields={[
          {
            field: 'category',
            placeholder: 'Все категории',
            options: categories.map(cat => ({ value: cat._id, label: cat.name }))
          },
          {
            field: 'isAvailable',
            placeholder: 'Доступность',
            options: [
              { value: 'true', label: 'Доступные' },
              { value: 'false', label: 'Недоступные' }
            ]
          }
        ]}
        sortFields={['name', 'price', 'weight', 'createdAt']}
        pagination={pagination}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onPageChange={handlePageChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Продукты не найдены"
        emptyDescription="Попробуйте изменить параметры поиска или добавьте новый продукт"
      />

      <EntityForm
        title="продукт"
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        entity={selectedProduct}
        schema={productSchema}
        fields={formFields}
        onSubmit={handleFormSubmit}
        onDelete={handleDelete}
        loading={formLoading}
        deleteConfirmMessage="Вы уверены, что хотите удалить этот продукт? Это действие нельзя отменить."
      />
    </>
  );
};

export default Products;