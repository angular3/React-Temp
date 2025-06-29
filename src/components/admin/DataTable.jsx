import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const DataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  searchFields = [],
  filterFields = [],
  sortFields = [],
  actions = {},
  pagination = {},
  onSearch,
  onFilter,
  onSort,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onCreate,
  customActions = [],
  emptyMessage = "Данные не найдены",
  emptyDescription = "Попробуйте изменить параметры поиска"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Обработка поиска
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Обработка фильтрации
  const handleFilter = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    if (!value) {
      delete newFilters[field];
    }
    setFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  // Обработка сортировки
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    if (onSort) {
      onSort(field, newDirection);
    }
  };

  // Очистка фильтров
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({});
    setSortField('');
    setSortDirection('asc');
    if (onSearch) onSearch('');
    if (onFilter) onFilter({});
    if (onSort) onSort('', 'asc');
  };

  // Рендер значения ячейки
  const renderCellValue = (item, column) => {
    const value = column.accessor ? item[column.accessor] : '';
    
    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === 'badge') {
      const variant = column.badgeVariant ? column.badgeVariant(value) : 'default';
      const label = column.badgeLabel ? column.badgeLabel(value) : value;
      return <Badge variant={variant}>{label}</Badge>;
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('ru-RU');
    }

    if (column.type === 'datetime') {
      return new Date(value).toLocaleString('ru-RU');
    }

    if (column.type === 'currency') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
      }).format(value);
    }

    if (column.type === 'boolean') {
      return value ? 'Да' : 'Нет';
    }

    return value;
  };

  // Рендер заголовка с сортировкой
  const renderHeader = (column) => {
    const isSortable = sortFields.includes(column.accessor);
    const isSorted = sortField === column.accessor;

    if (!isSortable) {
      return column.header;
    }

    return (
      <button
        className="flex items-center space-x-1 hover:text-primary"
        onClick={() => handleSort(column.accessor)}
      >
        <span>{column.header}</span>
        {isSorted && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-4 h-4" /> : 
            <ChevronDown className="w-4 h-4" />
        )}
      </button>
    );
  };

  // Рендер действий
  const renderActions = (item) => {
    return (
      <div className="flex space-x-2">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(item)}
            title="Просмотр"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            title="Редактировать"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {customActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "outline"}
            size="sm"
            onClick={() => action.onClick(item)}
            title={action.title}
            className={action.className}
          >
            {action.icon}
          </Button>
        ))}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(item)}
            className="text-red-600 hover:text-red-700"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        {onCreate && (
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        )}
      </div>

      {/* Фильтры и поиск */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Поиск */}
            {searchFields.length > 0 && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={`Поиск по ${searchFields.join(', ')}...`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Фильтры */}
            {filterFields.map((filter) => (
              <div key={filter.field} className="lg:w-64">
                <Select
                  value={filters[filter.field] || ''}
                  onValueChange={(value) => handleFilter(filter.field, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            {/* Очистка фильтров */}
            {(searchQuery || Object.keys(filters).length > 0) && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Очистить
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Таблица */}
      <Card>
        <CardHeader>
          <CardTitle>
            {title} ({pagination.total || data.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse flex space-x-4 p-4">
                  {columns.map((_, colIndex) => (
                    <div key={colIndex} className="h-4 bg-gray-300 rounded flex-1"></div>
                  ))}
                </div>
              ))}
            </div>
          ) : data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.accessor || column.header}>
                        {renderHeader(column)}
                      </TableHead>
                    ))}
                    {(onView || onEdit || onDelete || customActions.length > 0) && (
                      <TableHead>Действия</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={item._id || item.id || index}>
                      {columns.map((column) => (
                        <TableCell key={column.accessor || column.header}>
                          {renderCellValue(item, column)}
                        </TableCell>
                      ))}
                      {(onView || onEdit || onDelete || customActions.length > 0) && (
                        <TableCell>
                          {renderActions(item)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Пагинация */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Предыдущая
                  </Button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <Button
                        key={page}
                        variant={pagination.currentPage === page ? "default" : "outline"}
                        onClick={() => onPageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Следующая
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{emptyMessage}</h3>
              <p className="text-gray-600">{emptyDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTable;