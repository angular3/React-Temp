import React, { useState } from 'react';
import { Gift, Percent, Star, Clock, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const Promotions = () => {
  const [copiedCode, setCopiedCode] = useState('');

  const currentPromotions = [
    {
      id: 1,
      title: 'Скидка 20% на первый заказ',
      description: 'Специальное предложение для новых клиентов при заказе от 800₽',
      code: 'WELCOME20',
      discount: '20%',
      validUntil: '2024-12-31',
      minOrder: 800,
      type: 'new-customer',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      id: 2,
      title: 'Комбо обед за 399₽',
      description: 'Основное блюдо + напиток + десерт по специальной цене',
      code: 'COMBO399',
      discount: 'Фиксированная цена',
      validUntil: '2024-11-30',
      minOrder: 0,
      type: 'combo',
      color: 'bg-gradient-to-r from-green-500 to-blue-500'
    },
    {
      id: 3,
      title: 'Бесплатная доставка',
      description: 'При заказе от 1000₽ доставка абсолютно бесплатна',
      code: 'FREE1000',
      discount: 'Бесплатная доставка',
      validUntil: 'Постоянно',
      minOrder: 1000,
      type: 'delivery',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      id: 4,
      title: 'Скидка 15% на выходные',
      description: 'Специальная скидка на все заказы в субботу и воскресенье',
      code: 'WEEKEND15',
      discount: '15%',
      validUntil: 'Каждые выходные',
      minOrder: 600,
      type: 'weekend',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    }
  ];

  const loyaltyProgram = {
    levels: [
      { name: 'Бронзовый', orders: 5, discount: 5, color: 'bg-amber-600' },
      { name: 'Серебряный', orders: 15, discount: 10, color: 'bg-gray-400' },
      { name: 'Золотой', orders: 30, discount: 15, color: 'bg-yellow-500' },
      { name: 'Платиновый', orders: 50, discount: 20, color: 'bg-purple-600' }
    ]
  };

  const seasonalOffers = [
    {
      title: 'Зимнее меню',
      description: 'Согревающие супы и горячие напитки со скидкой 10%',
      period: 'Декабрь - Февраль',
      icon: '❄️'
    },
    {
      title: 'Весенние салаты',
      description: 'Свежие салаты с молодой зеленью по специальным ценам',
      period: 'Март - Май',
      icon: '🌱'
    },
    {
      title: 'Летние напитки',
      description: 'Освежающие лимонады и смузи с 15% скидкой',
      period: 'Июнь - Август',
      icon: '🍹'
    },
    {
      title: 'Осенние десерты',
      description: 'Тыквенные пироги и яблочные штрудели со скидкой',
      period: 'Сентябрь - Ноябрь',
      icon: '🍂'
    }
  ];

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Промокод скопирован!');
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Акции и скидки</h1>
            <p className="text-xl opacity-90 mb-8">
              Выгодные предложения и специальные акции для наших клиентов
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Percent className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">До 20%</div>
                <div className="text-sm opacity-80">Максимальная скидка</div>
              </div>
              <div className="text-center">
                <Gift className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">4+</div>
                <div className="text-sm opacity-80">Активных акций</div>
              </div>
              <div className="text-center">
                <Star className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">VIP</div>
                <div className="text-sm opacity-80">Программа лояльности</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Текущие акции */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Текущие акции</h2>
            <p className="text-gray-600">Действующие предложения и промокоды</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentPromotions.map((promo) => (
              <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`${promo.color} text-white p-6`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                      <p className="opacity-90 text-sm">{promo.description}</p>
                    </div>
                    <Badge className="bg-white text-gray-800 font-bold">
                      {promo.discount}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={promo.code}
                        readOnly
                        className="bg-white text-gray-800 font-mono text-sm w-32"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyPromoCode(promo.code)}
                        className="bg-white text-gray-800 hover:bg-gray-100"
                      >
                        {copiedCode === promo.code ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Действует до:</span>
                      <span className="font-medium">{promo.validUntil}</span>
                    </div>
                    {promo.minOrder > 0 && (
                      <div className="flex justify-between">
                        <span>Минимальный заказ:</span>
                        <span className="font-medium">{promo.minOrder}₽</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Программа лояльности */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Программа лояльности</h2>
            <p className="text-gray-600">Делайте заказы и получайте постоянные скидки</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-8">
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">Как это работает?</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Совершайте заказы и автоматически получайте статус лояльности. 
                    Чем больше заказов, тем выше ваша скидка на все последующие покупки.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {loyaltyProgram.levels.map((level, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 ${level.color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                        {level.discount}%
                      </div>
                      <h4 className="font-semibold mb-2">{level.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">От {level.orders} заказов</p>
                      <p className="text-sm font-medium text-orange-600">Скидка {level.discount}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Сезонные предложения */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Сезонные предложения</h2>
            <p className="text-gray-600">Специальные акции в зависимости от времени года</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalOffers.map((offer, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{offer.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                  <Badge variant="outline">{offer.period}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Условия использования */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Условия использования промокодов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Общие условия:</h4>
                    <ul className="space-y-1">
                      <li>• Один промокод на один заказ</li>
                      <li>• Промокоды не суммируются</li>
                      <li>• Действуют только при онлайн-заказе</li>
                      <li>• Скидка применяется к стоимости блюд</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Ограничения:</h4>
                    <ul className="space-y-1">
                      <li>• Не распространяется на доставку</li>
                      <li>• Минимальная сумма заказа может отличаться</li>
                      <li>• Срок действия ограничен</li>
                      <li>• Администрация оставляет право изменения условий</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Не упустите выгодные предложения!</h2>
          <p className="text-xl mb-8 opacity-90">
            Подпишитесь на уведомления и узнавайте о новых акциях первыми
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              placeholder="Ваш email" 
              className="bg-white text-gray-800"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100 whitespace-nowrap">
              Подписаться
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Promotions;