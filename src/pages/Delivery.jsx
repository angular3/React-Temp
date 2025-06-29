import React from 'react';
import { MapPin, Clock, CreditCard, Truck, Phone, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const Delivery = () => {
  const deliveryZones = [
    { name: 'Центральный район', time: '30-40 мин', price: 'Бесплатно от 1000₽' },
    { name: 'Северный район', time: '35-45 мин', price: '200₽' },
    { name: 'Южный район', time: '40-50 мин', price: '250₽' },
    { name: 'Восточный район', time: '35-45 мин', price: '200₽' },
    { name: 'Западный район', time: '40-50 мин', price: '250₽' },
    { name: 'Пригород', time: '50-60 мин', price: '300₽' }
  ];

  const paymentMethods = [
    {
      name: 'Банковская карта',
      description: 'Visa, MasterCard, МИР',
      icon: <CreditCard className="w-8 h-8 text-blue-500" />
    },
    {
      name: 'Наличные',
      description: 'Оплата курьеру при получении',
      icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">₽</div>
    },
    {
      name: 'СБП',
      description: 'Система быстрых платежей',
      icon: <Phone className="w-8 h-8 text-purple-500" />
    }
  ];

  const deliverySteps = [
    {
      step: 1,
      title: 'Выберите блюда',
      description: 'Добавьте понравившиеся блюда в корзину'
    },
    {
      step: 2,
      title: 'Оформите заказ',
      description: 'Укажите адрес доставки и способ оплаты'
    },
    {
      step: 3,
      title: 'Подтверждение',
      description: 'Мы свяжемся с вами для подтверждения заказа'
    },
    {
      step: 4,
      title: 'Приготовление',
      description: 'Наши повара готовят ваш заказ'
    },
    {
      step: 5,
      title: 'Доставка',
      description: 'Курьер доставит заказ по указанному адресу'
    }
  ];

  const deliveryConditions = [
    'Минимальная сумма заказа: 500₽',
    'Бесплатная доставка при заказе от 1000₽ в центральном районе',
    'Время доставки может увеличиваться в часы пик',
    'Доставка осуществляется с 10:00 до 23:00',
    'При заказе на сумму свыше 3000₽ - скидка 5%',
    'Возможна доставка в офисы и на мероприятия'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Доставка</h1>
            <p className="text-xl opacity-90 mb-8">
              Быстрая и надежная доставка вкусной еды прямо к вашему порогу
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">30-60 мин</div>
                <div className="text-sm opacity-80">Время доставки</div>
              </div>
              <div className="text-center">
                <Truck className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">Бесплатно</div>
                <div className="text-sm opacity-80">От 1000₽</div>
              </div>
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">6 районов</div>
                <div className="text-sm opacity-80">Зона доставки</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Зоны доставки */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Зоны доставки</h2>
            <p className="text-gray-600">Мы доставляем во все районы города</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryZones.map((zone, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{zone.name}</h3>
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Время:</span>
                      <Badge variant="outline">{zone.time}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Стоимость:</span>
                      <Badge className="bg-orange-500">{zone.price}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Как заказать */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Как сделать заказ</h2>
            <p className="text-gray-600">Простой процесс заказа в 5 шагов</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-orange-200 transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {deliverySteps.map((step, index) => (
                  <div key={index} className="text-center relative">
                    <div className="relative z-10 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Способы оплаты */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Способы оплаты</h2>
            <p className="text-gray-600">Выберите удобный для вас способ оплаты</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{method.name}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Условия доставки */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Условия доставки</h2>
              <p className="text-gray-600">Важная информация о доставке</p>
            </div>
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deliveryConditions.map((condition, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{condition}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Контактная информация */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Остались вопросы?</h2>
              <p className="text-gray-600">Свяжитесь с нами любым удобным способом</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-orange-500" />
                    Телефон
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600 mb-2">+7 (999) 123-45-67</p>
                  <p className="text-gray-600">Ежедневно с 10:00 до 23:00</p>
                  <Button className="mt-4 w-full">Позвонить</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                    Адрес кухни
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold mb-2">г. Москва, ул. Примерная, 123</p>
                  <p className="text-gray-600 mb-4">Центральная кухня и офис</p>
                  <Button variant="outline" className="w-full">Показать на карте</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы сделать заказ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Выберите блюда из нашего меню и мы доставим их быстро и горячими
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
            <a href="/products">Перейти к меню</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Delivery;