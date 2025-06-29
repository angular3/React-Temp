import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, MapPin, Phone, User, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import apiService from '../services/api';

const checkoutSchema = z.object({
  deliveryAddress: z.object({
    street: z.string().min(1, 'Адрес обязателен'),
    city: z.string().min(1, 'Город обязателен'),
    zipCode: z.string().min(1, 'Индекс обязателен'),
  }),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['card', 'cash', 'sbp']),
});

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: {
        street: '',
        city: 'Москва',
        zipCode: '',
      },
      phone: user?.phone || '',
      notes: '',
      paymentMethod: 'card',
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const deliveryFee = getTotalPrice() >= 1000 ? 0 : 200;
  const totalAmount = getTotalPrice() + deliveryFee;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        deliveryAddress: data.deliveryAddress,
        phone: data.phone,
        notes: data.notes,
        paymentMethod: data.paymentMethod
      };

      await apiService.createOrder(orderData);
      clearCart();
      toast.success('Заказ успешно оформлен!');
      navigate('/orders');
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      toast.error('Ошибка оформления заказа');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
            <p className="text-gray-600 mb-8">
              Добавьте блюда в корзину, чтобы оформить заказ
            </p>
            <Button onClick={() => navigate('/products')}>
              Перейти к меню
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Форма заказа */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Информация о клиенте */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Контактная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Имя</Label>
                        <Input value={user?.name || ''} disabled />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={user?.email || ''} disabled />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
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
                  </CardContent>
                </Card>

                {/* Адрес доставки */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Адрес доставки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="deliveryAddress.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Улица, дом, квартира</FormLabel>
                          <FormControl>
                            <Input placeholder="ул. Примерная, д. 123, кв. 45" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="deliveryAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Город</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите город" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Москва">Москва</SelectItem>
                                <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="deliveryAddress.zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Индекс</FormLabel>
                            <FormControl>
                              <Input placeholder="123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Комментарий к заказу</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Дополнительная информация для курьера..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Способ оплаты */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Способ оплаты
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="flex-1 cursor-pointer">
                                  <div className="flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    <div>
                                      <div className="font-medium">Банковская карта</div>
                                      <div className="text-sm text-gray-600">Visa, MasterCard, МИР</div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                <RadioGroupItem value="cash" id="cash" />
                                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">₽</div>
                                    <div>
                                      <div className="font-medium">Наличные</div>
                                      <div className="text-sm text-gray-600">Оплата курьеру при получении</div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                                <RadioGroupItem value="sbp" id="sbp" />
                                <Label htmlFor="sbp" className="flex-1 cursor-pointer">
                                  <div className="flex items-center">
                                    <Phone className="w-5 h-5 mr-2" />
                                    <div>
                                      <div className="font-medium">СБП</div>
                                      <div className="text-sm text-gray-600">Система быстрых платежей</div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Оформление...' : `Оформить заказ на ${formatPrice(totalAmount)}`}
                </Button>
              </form>
            </Form>
          </div>

          {/* Сводка заказа */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  
                  <hr />
                  
                  <div className="flex justify-between">
                    <span>Стоимость блюд:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Бесплатно</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>

                  {getTotalPrice() < 1000 && (
                    <div className="text-sm text-gray-600 p-3 bg-orange-50 rounded-lg">
                      Добавьте еще {formatPrice(1000 - getTotalPrice())} для бесплатной доставки
                    </div>
                  )}

                  <hr />

                  <div className="flex justify-between text-lg font-bold">
                    <span>К оплате:</span>
                    <span className="text-orange-600">{formatPrice(totalAmount)}</span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Время доставки: 30-45 минут</p>
                    <p>• Мы свяжемся с вами для подтверждения</p>
                    <p>• Оплата при получении или онлайн</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;