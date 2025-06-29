import React from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Условия использования</h1>
            <p className="text-gray-600">
              Последнее обновление: 1 января 2024 года
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Общие положения
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Настоящие Условия использования (далее — "Условия") регулируют отношения 
                  между пользователями и сервисом доставки еды "ВкусноЕда" (далее — "Сервис", 
                  "мы", "наш").
                </p>
                <p>
                  Используя наш сервис, вы соглашаетесь соблюдать данные Условия. 
                  Если вы не согласны с какими-либо положениями, пожалуйста, 
                  не используйте наш сервис.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Описание сервиса</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  "ВкусноЕда" — это онлайн-платформа для заказа и доставки еды, 
                  которая предоставляет следующие услуги:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Онлайн-заказ блюд</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Доставка еды на дом</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Онлайн-оплата</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Отслеживание заказов</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Программа лояльности</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Служба поддержки</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Регистрация и аккаунт</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Требования к регистрации:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Возраст не менее 18 лет</li>
                      <li>Предоставление достоверной информации</li>
                      <li>Один аккаунт на одного пользователя</li>
                      <li>Действующий номер телефона и email</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Ответственность пользователя:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Сохранение конфиденциальности данных для входа</li>
                      <li>Немедленное уведомление о компрометации аккаунта</li>
                      <li>Ответственность за все действия в аккаунте</li>
                      <li>Обновление личной информации при изменениях</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Заказы и оплата</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Процесс заказа:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">1. Оформление</h4>
                        <p className="text-sm text-gray-700">
                          Выбор блюд, указание адреса доставки и способа оплаты
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">2. Подтверждение</h4>
                        <p className="text-sm text-gray-700">
                          Проверка заказа и подтверждение оператором
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">3. Приготовление</h4>
                        <p className="text-sm text-gray-700">
                          Приготовление блюд на кухне ресторана
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">4. Доставка</h4>
                        <p className="text-sm text-gray-700">
                          Доставка заказа по указанному адресу
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Условия оплаты:</h3>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <ul className="space-y-1 text-sm">
                        <li>• Минимальная сумма заказа: 500 рублей</li>
                        <li>• Бесплатная доставка при заказе от 1000 рублей</li>
                        <li>• Оплата картой онлайн или наличными курьеру</li>
                        <li>• Возврат средств в течение 14 дней при отмене заказа</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Доставка</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">30-60 мин</div>
                      <div className="text-sm text-gray-600">Время доставки</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">10:00-23:00</div>
                      <div className="text-sm text-gray-600">Часы работы</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">6 районов</div>
                      <div className="text-sm text-gray-600">Зона доставки</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Условия доставки:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Доставка осуществляется только в пределах зоны обслуживания</li>
                      <li>Время доставки может увеличиваться в часы пик</li>
                      <li>Курьер обязан предъявить заказ для проверки</li>
                      <li>При отсутствии клиента заказ ожидается 15 минут</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  Отмена и возврат
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Возможна отмена:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• В течение 5 минут после оформления заказа</li>
                      <li>• До начала приготовления блюд</li>
                      <li>• При форс-мажорных обстоятельствах</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Отмена невозможна:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• После начала приготовления</li>
                      <li>• Во время доставки</li>
                      <li>• После получения заказа</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Возврат средств:</h4>
                    <p className="text-sm text-gray-700">
                      При отмене заказа по вине сервиса возврат осуществляется в полном объеме 
                      в течение 3-5 рабочих дней на карту, с которой была произведена оплата.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-500" />
                  Запрещенные действия
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Запрещается:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Использование чужих данных</li>
                      <li>• Создание фиктивных заказов</li>
                      <li>• Злоупотребление системой скидок</li>
                      <li>• Оскорбление персонала</li>
                      <li>• Попытки взлома системы</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Последствия нарушений:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Предупреждение</li>
                      <li>• Временная блокировка</li>
                      <li>• Постоянная блокировка</li>
                      <li>• Обращение в правоохранительные органы</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ответственность сторон</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Наша ответственность:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Качество и свежесть блюд</li>
                      <li>Соблюдение времени доставки</li>
                      <li>Сохранность персональных данных</li>
                      <li>Работоспособность сервиса</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Ответственность пользователя:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Предоставление корректной информации</li>
                      <li>Своевременная оплата заказов</li>
                      <li>Соблюдение правил использования</li>
                      <li>Уважительное отношение к персоналу</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Ограничение ответственности:</h4>
                    <p className="text-sm text-gray-700">
                      Наша ответственность ограничивается стоимостью заказа. 
                      Мы не несем ответственности за косвенные убытки, 
                      упущенную выгоду или моральный вред.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Разрешение споров</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Порядок рассмотрения жалоб:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <span className="text-sm">Обращение в службу поддержки</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <span className="text-sm">Рассмотрение в течение 24 часов</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <span className="text-sm">Предложение решения</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        <span className="text-sm">Обращение в суд при необходимости</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Контакты для обращений:</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Email:</strong> support@vkusnoeda.ru</p>
                      <p><strong>Телефон:</strong> +7 (999) 123-45-67</p>
                      <p><strong>Время работы:</strong> Ежедневно с 10:00 до 23:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Изменения условий</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Мы оставляем за собой право изменять данные Условия использования. 
                  О существенных изменениях мы уведомим пользователей не менее чем 
                  за 7 дней до вступления изменений в силу.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Важно:</strong> Продолжение использования сервиса после 
                    внесения изменений означает ваше согласие с новыми условиями.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Юридическая информация:</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>ООО "ВкусноЕда"</p>
                      <p>ИНН: 1234567890</p>
                      <p>ОГРН: 1234567890123</p>
                      <p>Адрес: г. Москва, ул. Примерная, 123</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Контакты:</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>Email: legal@vkusnoeda.ru</p>
                      <p>Телефон: +7 (999) 123-45-67</p>
                      <p>Факс: +7 (499) 123-45-67</p>
                      <p>Время работы: Пн-Пт 9:00-18:00</p>
                    </div>
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

export default Terms;