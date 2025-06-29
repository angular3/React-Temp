import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  subject: z.string().min(1, 'Выберите тему обращения'),
  message: z.string().min(10, 'Сообщение должно содержать минимум 10 символов'),
});

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const subjects = [
    { value: 'order', label: 'Вопрос по заказу' },
    { value: 'delivery', label: 'Проблема с доставкой' },
    { value: 'quality', label: 'Качество блюд' },
    { value: 'cooperation', label: 'Сотрудничество' },
    { value: 'suggestion', label: 'Предложение' },
    { value: 'other', label: 'Другое' }
  ];

  const faqItems = [
    {
      question: 'Как долго доставляется заказ?',
      answer: 'Обычно доставка занимает 30-45 минут в пределах города. В часы пик время может увеличиваться до 60 минут.'
    },
    {
      question: 'Какая минимальная сумма заказа?',
      answer: 'Минимальная сумма заказа составляет 500 рублей. При заказе от 1000 рублей доставка бесплатная.'
    },
    {
      question: 'Можно ли отменить заказ?',
      answer: 'Заказ можно отменить в течение 5 минут после оформления. После начала приготовления отмена невозможна.'
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем оплату банковскими картами, наличными при получении и через систему быстрых платежей (СБП).'
    },
    {
      question: 'Доставляете ли вы в выходные?',
      answer: 'Да, мы работаем без выходных с 10:00 до 23:00. В праздничные дни график может изменяться.'
    },
    {
      question: 'Что делать, если заказ не соответствует ожиданиям?',
      answer: 'Если вы не довольны качеством заказа, свяжитесь с нами в течение 30 минут после получения. Мы обязательно решим проблему.'
    },
    {
      question: 'Есть ли программа лояльности?',
      answer: 'Да, у нас есть система накопительных скидок. Чем больше заказов, тем выше ваша персональная скидка.'
    },
    {
      question: 'Можно ли заказать на определенное время?',
      answer: 'Да, при оформлении заказа вы можете указать желаемое время доставки. Мы стараемся соблюдать указанное время.'
    }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Здесь будет отправка формы на сервер
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      form.reset();
    } catch (error) {
      toast.error('Ошибка отправки сообщения. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Контакты</h1>
            <p className="text-xl opacity-90 mb-8">
              Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь!
            </p>
          </div>
        </div>
      </section>

      {/* Контактная информация */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Phone className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2">Телефон</h3>
                <p className="text-2xl font-bold text-orange-600 mb-2">+7 (999) 123-45-67</p>
                <p className="text-gray-600 text-sm">Ежедневно с 10:00 до 23:00</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Mail className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-lg font-medium mb-2">info@vkusnoeda.ru</p>
                <p className="text-gray-600 text-sm">Ответим в течение часа</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2">Адрес</h3>
                <p className="text-lg font-medium mb-2">г. Москва, ул. Примерная, 123</p>
                <p className="text-gray-600 text-sm">Центральная кухня</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2">Режим работы</h3>
                <p className="text-lg font-medium mb-2">10:00 - 23:00</p>
                <p className="text-gray-600 text-sm">Без выходных</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Форма обратной связи */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Форма обратной связи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
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
                      </div>

                      <FormField
                        control={form.control}
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
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Тема обращения</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите тему" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.value} value={subject.value}>
                                    {subject.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Сообщение</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Опишите ваш вопрос или предложение..."
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-orange-500 hover:bg-orange-600" 
                        disabled={loading}
                      >
                        {loading ? (
                          'Отправка...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Отправить сообщение
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Карта */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Как нас найти</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Интерактивная карта</p>
                      <p className="text-sm text-gray-500">г. Москва, ул. Примерная, 123</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Ближайшее метро:</strong> Примерная (5 минут пешком)</p>
                    <p><strong>Парковка:</strong> Бесплатная парковка для клиентов</p>
                    <p><strong>Доступность:</strong> Вход оборудован для людей с ограниченными возможностями</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Часто задаваемые вопросы</h2>
              <p className="text-gray-600">Ответы на самые популярные вопросы наших клиентов</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Социальные сети */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Мы в социальных сетях</h2>
            <p className="text-gray-600">Следите за новостями и акциями в наших социальных сетях</p>
          </div>

          <div className="flex justify-center space-x-6">
            <a href="#" className="bg-blue-600 p-4 rounded-full hover:bg-blue-700 transition-colors text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="bg-blue-800 p-4 rounded-full hover:bg-blue-900 transition-colors text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" className="bg-pink-600 p-4 rounded-full hover:bg-pink-700 transition-colors text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </a>
            <a href="#" className="bg-green-600 p-4 rounded-full hover:bg-green-700 transition-colors text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;