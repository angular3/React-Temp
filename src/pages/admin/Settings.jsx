import React, { useState } from 'react';
import { Save, Upload, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Название сайта обязательно'),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email('Введите корректный email'),
  contactPhone: z.string().min(1, 'Телефон обязателен'),
  address: z.string().min(1, 'Адрес обязателен'),
  deliveryFee: z.number().min(0, 'Стоимость доставки должна быть положительной'),
  freeDeliveryThreshold: z.number().min(0, 'Порог бесплатной доставки должен быть положительным'),
  workingHours: z.string().min(1, 'Время работы обязательно'),
  isDeliveryEnabled: z.boolean(),
  isOrderingEnabled: z.boolean(),
});

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: 'ВкусноЕда',
      siteDescription: 'Доставка вкусной еды прямо к вашему порогу',
      contactEmail: 'info@vkusnoeda.ru',
      contactPhone: '+7 (999) 123-45-67',
      address: 'г. Москва, ул. Примерная, 123',
      deliveryFee: 200,
      freeDeliveryThreshold: 1000,
      workingHours: 'Пн-Вс: 10:00 - 23:00',
      isDeliveryEnabled: true,
      isOrderingEnabled: true,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Здесь будет API запрос для сохранения настроек
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      toast.success('Настройки сохранены');
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      toast.error('Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управляйте основными настройками вашего ресторана
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название сайта</FormLabel>
                      <FormControl>
                        <Input placeholder="Название вашего ресторана" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email для связи</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@restaurant.ru" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание сайта</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Краткое описание вашего ресторана" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Телефон</FormLabel>
                      <FormControl>
                        <Input placeholder="+7 (999) 123-45-67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Время работы</FormLabel>
                      <FormControl>
                        <Input placeholder="Пн-Вс: 10:00 - 23:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="г. Москва, ул. Примерная, 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Настройки доставки */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки доставки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deliveryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Стоимость доставки (₽)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="200" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="freeDeliveryThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сумма для бесплатной доставки (₽)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1000" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isDeliveryEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <FormLabel className="text-base">Доставка включена</FormLabel>
                        <p className="text-sm text-gray-600">
                          Разрешить клиентам заказывать доставку
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isOrderingEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <FormLabel className="text-base">Прием заказов включен</FormLabel>
                        <p className="text-sm text-gray-600">
                          Разрешить клиентам делать заказы
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Управление данными */}
          <Card>
            <CardHeader>
              <CardTitle>Управление данными</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Экспорт данных</label>
                  <p className="text-sm text-gray-600">
                    Скачать все данные в формате JSON
                  </p>
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Экспортировать данные
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Очистка кэша</label>
                  <p className="text-sm text-gray-600">
                    Очистить кэш изображений и данных
                  </p>
                  <Button variant="outline" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Очистить кэш
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-32">
              {loading ? (
                'Сохранение...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Settings;