import React from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Политика конфиденциальности</h1>
            <p className="text-gray-600">
              Последнее обновление: 1 января 2024 года
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Общие положения
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Настоящая Политика конфиденциальности определяет порядок обработки и защиты 
                  персональных данных пользователей сервиса доставки еды "ВкусноЕда" 
                  (далее — "Сервис", "мы", "наш").
                </p>
                <p>
                  Используя наш сервис, вы соглашаетесь с условиями данной Политики 
                  конфиденциальности и даете согласие на обработку ваших персональных данных 
                  в соответствии с целями и способами, описанными ниже.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Какие данные мы собираем
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Персональные данные:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Имя и фамилия</li>
                      <li>Адрес электронной почты</li>
                      <li>Номер телефона</li>
                      <li>Адрес доставки</li>
                      <li>Данные платежных карт (в зашифрованном виде)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Техническая информация:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>IP-адрес</li>
                      <li>Тип браузера и операционной системы</li>
                      <li>Данные о посещенных страницах</li>
                      <li>Время и дата посещения</li>
                      <li>Файлы cookie</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Информация о заказах:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>История заказов</li>
                      <li>Предпочтения в еде</li>
                      <li>Отзывы и оценки</li>
                      <li>Частота заказов</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Цели обработки данных
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Обработка заказов</h4>
                      <p className="text-gray-600 text-sm">
                        Для оформления, подтверждения и доставки ваших заказов
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Связь с клиентами</h4>
                      <p className="text-gray-600 text-sm">
                        Для уведомлений о статусе заказа и решения возникающих вопросов
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Персонализация</h4>
                      <p className="text-gray-600 text-sm">
                        Для предоставления персональных рекомендаций и улучшения сервиса
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Маркетинг</h4>
                      <p className="text-gray-600 text-sm">
                        Для отправки информации о акциях и специальных предложениях (с вашего согласия)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Аналитика</h4>
                      <p className="text-gray-600 text-sm">
                        Для анализа использования сервиса и улучшения качества услуг
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Защита данных
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Мы применяем современные технические и организационные меры для защиты 
                    ваших персональных данных от несанкционированного доступа, изменения, 
                    раскрытия или уничтожения.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Технические меры:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• SSL-шифрование</li>
                        <li>• Защищенные серверы</li>
                        <li>• Регулярные обновления безопасности</li>
                        <li>• Мониторинг доступа</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Организационные меры:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Ограниченный доступ к данным</li>
                        <li>• Обучение сотрудников</li>
                        <li>• Политики безопасности</li>
                        <li>• Регулярные аудиты</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Использование файлов Cookie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Наш сайт использует файлы cookie для улучшения пользовательского опыта 
                    и функционирования сервиса.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Необходимые cookie</h4>
                      <p className="text-sm text-gray-600">
                        Обеспечивают базовую функциональность сайта (авторизация, корзина)
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Аналитические cookie</h4>
                      <p className="text-sm text-gray-600">
                        Помогают понять, как посетители используют сайт
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Маркетинговые cookie</h4>
                      <p className="text-sm text-gray-600">
                        Используются для показа релевантной рекламы
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Вы можете управлять настройками cookie в своем браузере или через 
                    настройки на нашем сайте.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ваши права</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Право на доступ</h4>
                    <p className="text-sm text-gray-600">
                      Вы можете запросить информацию о том, какие данные мы о вас храним
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Право на исправление</h4>
                    <p className="text-sm text-gray-600">
                      Вы можете исправить неточные или неполные данные
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Право на удаление</h4>
                    <p className="text-sm text-gray-600">
                      Вы можете запросить удаление ваших персональных данных
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Право на ограничение обработки</h4>
                    <p className="text-sm text-gray-600">
                      Вы можете ограничить способы обработки ваших данных
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Право на отзыв согласия</h4>
                    <p className="text-sm text-gray-600">
                      Вы можете отозвать согласие на обработку данных в любое время
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Передача данных третьим лицам</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Мы можем передавать ваши данные третьим лицам только в следующих случаях:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Партнеры по доставке</h4>
                      <p className="text-gray-600 text-sm">
                        Для осуществления доставки заказов (только необходимая информация)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Платежные системы</h4>
                      <p className="text-gray-600 text-sm">
                        Для обработки платежей (в зашифрованном виде)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Государственные органы</h4>
                      <p className="text-gray-600 text-sm">
                        При наличии законных требований
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  По вопросам обработки персональных данных вы можете обратиться к нам:
                </p>
                
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@vkusnoeda.ru</p>
                  <p><strong>Телефон:</strong> +7 (999) 123-45-67</p>
                  <p><strong>Адрес:</strong> г. Москва, ул. Примерная, 123</p>
                </div>
                
                <p className="mt-4 text-sm text-gray-600">
                  Мы обязуемся рассмотреть ваше обращение в течение 30 дней с момента получения.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Изменения в политике</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Мы оставляем за собой право вносить изменения в данную Политику 
                  конфиденциальности. О существенных изменениях мы уведомим вас 
                  по электронной почте или через уведомления на сайте.
                </p>
                
                <p className="mt-4 text-sm text-gray-600">
                  Рекомендуем периодически просматривать данную страницу для 
                  ознакомления с актуальной версией Политики конфиденциальности.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;