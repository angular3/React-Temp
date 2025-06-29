import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, MapPin, Phone, Mail, Bell, Lock, Heart, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  newPassword: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    sms: true,
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        zipCode: user?.address?.zipCode || '',
      },
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const favoriteItems = [
    {
      id: 1,
      name: 'Пицца Маргарита',
      price: 850,
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      category: 'Пицца'
    },
    {
      id: 2,
      name: 'Бургер Классик',
      price: 450,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      category: 'Бургеры'
    },
    {
      id: 3,
      name: 'Салат Цезарь',
      price: 380,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      category: 'Салаты'
    }
  ];

  const loyaltyInfo = {
    level: 'Серебряный',
    orders: 15,
    nextLevel: 'Золотой',
    ordersToNext: 15,
    discount: 10
  };

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      // Здесь будет API запрос для обновления профиля
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Профиль обновлен');
    } catch (error) {
      toast.error('Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      // Здесь будет API запрос для смены пароля
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Пароль изменен');
      passwordForm.reset();
    } catch (error) {
      toast.error('Ошибка смены пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Настройки уведомлений обновлены');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            <TabsTrigger value="favorites">Избранное</TabsTrigger>
            <TabsTrigger value="loyalty">Лояльность</TabsTrigger>
            <TabsTrigger value="password">Пароль</TabsTrigger>
          </TabsList>

          {/* Профиль */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Личная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя</FormLabel>
                              <FormControl>
                                <Input placeholder="Ваше имя" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
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
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Адрес
                          </h3>
                          
                          <FormField
                            control={profileForm.control}
                            name="address.street"
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
                              control={profileForm.control}
                              name="address.city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Город</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Москва" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="address.zipCode"
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
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                          {loading ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">15</div>
                      <div className="text-sm text-gray-600">Заказов сделано</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">25,450₽</div>
                      <div className="text-sm text-gray-600">Потрачено всего</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">10%</div>
                      <div className="text-sm text-gray-600">Текущая скидка</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Уведомления */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Настройки уведомлений
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Обновления заказов</h3>
                    <p className="text-sm text-gray-600">Уведомления о статусе ваших заказов</p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(value) => handleNotificationChange('orderUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Акции и скидки</h3>
                    <p className="text-sm text-gray-600">Информация о специальных предложениях</p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(value) => handleNotificationChange('promotions', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Новостная рассылка</h3>
                    <p className="text-sm text-gray-600">Новости компании и новые блюда</p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(value) => handleNotificationChange('newsletter', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS уведомления</h3>
                    <p className="text-sm text-gray-600">Важные уведомления по SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(value) => handleNotificationChange('sms', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Избранное */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Избранные блюда
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoriteItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Нет избранных блюд</h3>
                    <p className="text-gray-600 mb-4">
                      Добавьте блюда в избранное, чтобы быстро их найти
                    </p>
                    <Button onClick={() => window.location.href = '/products'}>
                      Перейти к меню
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="relative h-48">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            {item.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{item.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-orange-600">
                              {formatPrice(item.price)}
                            </span>
                            <Button size="sm">В корзину</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Программа лояльности */}
          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Программа лояльности
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-400 rounded-full text-white text-2xl font-bold mb-4">
                    {loyaltyInfo.discount}%
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{loyaltyInfo.level}</h3>
                  <p className="text-gray-600">Ваш текущий уровень лояльности</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{loyaltyInfo.orders}</div>
                    <div className="text-sm text-gray-600">Заказов сделано</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{loyaltyInfo.discount}%</div>
                    <div className="text-sm text-gray-600">Текущая скидка</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{loyaltyInfo.ordersToNext}</div>
                    <div className="text-sm text-gray-600">До следующего уровня</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4">Прогресс до уровня "{loyaltyInfo.nextLevel}"</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(loyaltyInfo.orders / (loyaltyInfo.orders + loyaltyInfo.ordersToNext)) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Сделайте еще {loyaltyInfo.ordersToNext} заказов для получения скидки 15%
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Уровни лояльности:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Бронзовый (5+ заказов)</span>
                      <Badge>5% скидка</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <span>Серебряный (15+ заказов)</span>
                      <Badge>10% скидка</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Золотой (30+ заказов)</span>
                      <Badge>15% скидка</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Платиновый (50+ заказов)</span>
                      <Badge>20% скидка</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Смена пароля */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Изменение пароля
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Текущий пароль</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Введите текущий пароль" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Новый пароль</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Введите новый пароль" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подтвердите пароль</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Повторите новый пароль" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={loading}>
                      {loading ? 'Изменение...' : 'Изменить пароль'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;