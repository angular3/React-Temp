import React, { useState, useEffect } from 'react';
import { Save, X, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const EntityForm = ({
  title,
  isOpen,
  onClose,
  mode = 'view', // 'view', 'create', 'edit'
  entity = null,
  schema,
  fields = [],
  onSubmit,
  onDelete,
  loading = false,
  deleteConfirmMessage = "Вы уверены, что хотите удалить этот элемент?"
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: getDefaultValues(fields)
  });

  // Получение значений по умолчанию из полей
  function getDefaultValues(fields) {
    const defaults = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue;
      } else {
        switch (field.type) {
          case 'boolean':
            defaults[field.name] = false;
            break;
          case 'number':
            defaults[field.name] = 0;
            break;
          case 'array':
            defaults[field.name] = [];
            break;
          default:
            defaults[field.name] = '';
        }
      }
    });
    return defaults;
  }

  // Заполнение формы данными сущности
  useEffect(() => {
    if (entity && (mode === 'edit' || mode === 'view')) {
      const formData = {};
      fields.forEach(field => {
        let value = entity[field.name];
        
        // Обработка специальных типов
        if (field.type === 'array' && typeof value === 'string') {
          value = value.split(',').map(item => item.trim());
        } else if (field.type === 'select' && field.valueKey) {
          value = entity[field.valueKey];
        }
        
        formData[field.name] = value !== undefined ? value : form.getValues(field.name);
      });
      form.reset(formData);
    } else if (mode === 'create') {
      form.reset(getDefaultValues(fields));
    }
  }, [entity, mode, fields, form]);

  // Обработка отправки формы
  const handleSubmit = async (data) => {
    if (mode === 'view') return;
    
    // Обработка специальных типов данных
    const processedData = { ...data };
    fields.forEach(field => {
      if (field.type === 'array' && typeof processedData[field.name] === 'string') {
        processedData[field.name] = processedData[field.name]
          .split(',')
          .map(item => item.trim())
          .filter(item => item);
      }
    });

    if (onSubmit) {
      await onSubmit(processedData, mode);
    }
  };

  // Обработка удаления
  const handleDelete = async () => {
    if (onDelete && entity) {
      await onDelete(entity);
      setShowDeleteConfirm(false);
    }
  };

  // Рендер поля формы
  const renderField = (field) => {
    const isReadonly = mode === 'view';
    const fieldValue = form.watch(field.name);

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={field.className}>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {renderFieldInput(field, formField, isReadonly, fieldValue)}
            </FormControl>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  // Рендер инпута поля
  const renderFieldInput = (field, formField, isReadonly, fieldValue) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            disabled={isReadonly}
            {...formField}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled={isReadonly}
            {...formField}
            onChange={(e) => formField.onChange(Number(e.target.value))}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            disabled={isReadonly}
            rows={field.rows || 3}
            {...formField}
          />
        );

      case 'select':
        if (isReadonly) {
          const selectedOption = field.options?.find(opt => opt.value === fieldValue);
          return (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {selectedOption?.label || fieldValue}
            </div>
          );
        }
        return (
          <Select onValueChange={formField.onChange} value={formField.value}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        if (isReadonly) {
          return (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Badge variant={fieldValue ? "default" : "secondary"}>
                {fieldValue ? 'Да' : 'Нет'}
              </Badge>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
            <span className="text-sm">{fieldValue ? 'Да' : 'Нет'}</span>
          </div>
        );

      case 'array':
        const arrayValue = Array.isArray(fieldValue) ? fieldValue.join(', ') : fieldValue;
        if (isReadonly) {
          return (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {arrayValue || 'Не указано'}
            </div>
          );
        }
        return (
          <Textarea
            placeholder={field.placeholder || "Введите значения через запятую"}
            value={arrayValue}
            onChange={(e) => formField.onChange(e.target.value)}
            rows={field.rows || 2}
          />
        );

      case 'file':
        if (isReadonly && fieldValue) {
          return (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <img src={fieldValue} alt="Preview" className="max-w-32 max-h-32 object-cover rounded" />
            </div>
          );
        }
        return (
          <Input
            type="file"
            accept={field.accept}
            disabled={isReadonly}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                formField.onChange(file);
              }
            }}
          />
        );

      case 'date':
        if (isReadonly) {
          return (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {fieldValue ? new Date(fieldValue).toLocaleDateString('ru-RU') : 'Не указано'}
            </div>
          );
        }
        return (
          <Input
            type="date"
            disabled={isReadonly}
            {...formField}
          />
        );

      case 'datetime':
        if (isReadonly) {
          return (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {fieldValue ? new Date(fieldValue).toLocaleString('ru-RU') : 'Не указано'}
            </div>
          );
        }
        return (
          <Input
            type="datetime-local"
            disabled={isReadonly}
            {...formField}
          />
        );

      case 'custom':
        return field.render ? field.render(formField, isReadonly, fieldValue) : null;

      default:
        return (
          <Input
            placeholder={field.placeholder}
            disabled={isReadonly}
            {...formField}
          />
        );
    }
  };

  // Получение заголовка модального окна
  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return `Создать ${title.toLowerCase()}`;
      case 'edit':
        return `Редактировать ${title.toLowerCase()}`;
      case 'view':
        return `Просмотр ${title.toLowerCase()}`;
      default:
        return title;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {getModalTitle()}
              <div className="flex space-x-2">
                {mode === 'view' && onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Рендер полей в сетке */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => {
                  if (field.fullWidth) {
                    return (
                      <div key={field.name} className="md:col-span-2">
                        {renderField(field)}
                      </div>
                    );
                  }
                  return renderField(field);
                })}
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  {mode === 'view' ? 'Закрыть' : 'Отмена'}
                </Button>
                
                {mode !== 'view' && (
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      'Сохранение...'
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {mode === 'create' ? 'Создать' : 'Сохранить'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Подтверждение удаления */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{deleteConfirmMessage}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EntityForm;