import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Leaf, Wheat, Heart } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import ProductCard from '../components/ProductCard';
import apiService from '../services/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [dietFilters, setDietFilters] = useState({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    lowCalorie: false
  });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const dietOptions = [
    { key: 'vegan', label: 'Веганские', icon: <Leaf className="w-4 h-4" /> },
    { key: 'vegetarian', label: 'Вегетарианские', icon: <Heart className="w-4 h-4" /> },
    { key: 'glutenFree', label: 'Без глютена', icon: <Wheat className="w-4 h-4" /> },
    { key: 'lowCalorie', label: 'Низкокалорийные', icon: <div className="w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">!</div> }
  ];

  const sortOptions = [
    { value: 'name', label: 'По названию' },
    { value: 'price_asc', label: 'Цена: по возрастанию' },
    { value: 'price_desc', label: 'Цена: по убыванию' },
    { value: 'rating', label: 'По рейтингу' },
    { value: 'calories', label: 'По калориям' },
    { value: 'popular', label: 'Популярные' }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams, currentPage, sortBy, dietFilters, priceRange]);

  const loadCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      const search = searchParams.get('search');
      const category = searchParams.get('category');

      if (search) params.search = search;
      if (category) params.category = category;
      
      // Добавляем фильтры по диете
      Object.keys(dietFilters).forEach(key => {
        if (dietFilters[key]) {
          params[key] = true;
        }
      });

      // Добавляем фильтры по цене
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;

      const response = await apiService.getProducts(params);
      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (categoryId && categoryId !== 'all') {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    
    setSearchParams(newParams);
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleDietFilterChange = (filterKey, checked) => {
    setDietFilters(prev => ({
      ...prev,
      [filterKey]: checked
    }));
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('name');
    setDietFilters({
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      lowCalorie: false
    });
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchParams.get('search')) count++;
    if (searchParams.get('category')) count++;
    if (Object.values(dietFilters).some(Boolean)) count++;
    if (priceRange.min || priceRange.max) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Наше меню</h1>
          <p className="text-gray-600">Выберите из широкого ассортимента вкусных блюд</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar с фильтрами */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Фильтры</h3>
                {getActiveFiltersCount() > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Очистить ({getActiveFiltersCount()})
                  </Button>
                )}
              </div>

              {/* Поиск */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Поиск</label>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Поиск блюд..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </form>
              </div>

              {/* Категории */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Категория</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Диетические предпочтения */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Диетические предпочтения</label>
                <div className="space-y-3">
                  {dietOptions.map((option) => (
                    <div key={option.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.key}
                        checked={dietFilters[option.key]}
                        onCheckedChange={(checked) => handleDietFilterChange(option.key, checked)}
                      />
                      <label htmlFor={option.key} className="flex items-center space-x-2 text-sm cursor-pointer">
                        {option.icon}
                        <span>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ценовой диапазон */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Цена, ₽</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="От"
                    value={priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="До"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  />
                </div>
              </div>

              {/* Сортировка */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Сортировка</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="lg:col-span-3">
            {/* Активные фильтры */}
            {getActiveFiltersCount() > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {searchParams.get('search') && (
                    <Badge variant="secondary">
                      Поиск: {searchParams.get('search')}
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary">
                      Категория: {categories.find(c => c._id === selectedCategory)?.name}
                    </Badge>
                  )}
                  {Object.entries(dietFilters).map(([key, value]) => 
                    value && (
                      <Badge key={key} variant="secondary">
                        {dietOptions.find(o => o.key === key)?.label}
                      </Badge>
                    )
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <Badge variant="secondary">
                      Цена: {priceRange.min || '0'} - {priceRange.max || '∞'} ₽
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Результаты */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-300 h-8 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Пагинация */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Предыдущая
                    </Button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Следующая
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
                <p className="text-gray-600 mb-4">
                  Попробуйте изменить параметры поиска или выбрать другую категорию
                </p>
                <Button onClick={clearFilters}>
                  Показать все блюда
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;