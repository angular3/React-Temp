import React from 'react';
import { Users, Award, Heart, Clock, ChefHat, Truck } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const About = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: 'Качество',
      description: 'Мы используем только свежие и качественные продукты от проверенных поставщиков'
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: 'Скорость',
      description: 'Быстрое приготовление и доставка - ваш заказ будет готов в кратчайшие сроки'
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: 'Клиентоориентированность',
      description: 'Каждый клиент важен для нас, мы стремимся превзойти ваши ожидания'
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      title: 'Профессионализм',
      description: 'Наша команда состоит из опытных поваров и специалистов сферы питания'
    }
  ];

  const team = [
    {
      name: 'Александр Иванов',
      position: 'Шеф-повар',
      experience: '15 лет опыта',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=300&h=300&fit=crop&crop=face',
      description: 'Мастер европейской кухни с опытом работы в ресторанах Michelin'
    },
    {
      name: 'Мария Петрова',
      position: 'Су-шеф',
      experience: '10 лет опыта',
      image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?w=300&h=300&fit=crop&crop=face',
      description: 'Специалист по азиатской кухне и современным кулинарным техникам'
    },
    {
      name: 'Дмитрий Сидоров',
      position: 'Менеджер по качеству',
      experience: '8 лет опыта',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=300&h=300&fit=crop&crop=face',
      description: 'Контролирует качество продуктов и соблюдение стандартов приготовления'
    }
  ];

  const partners = [
    {
      name: 'ЭкоФерма',
      type: 'Поставщик овощей',
      description: 'Органические овощи и зелень с собственных полей'
    },
    {
      name: 'МясКомбинат',
      type: 'Поставщик мяса',
      description: 'Свежее мясо высшего качества с сертификацией'
    },
    {
      name: 'РыбПром',
      type: 'Поставщик рыбы',
      description: 'Свежая морская и речная рыба ежедневных поставок'
    },
    {
      name: 'МолокоПродукт',
      type: 'Молочные продукты',
      description: 'Натуральные молочные продукты от местных фермеров'
    }
  ];

  const achievements = [
    { year: '2020', event: 'Основание компании' },
    { year: '2021', event: 'Запуск службы доставки' },
    { year: '2022', event: 'Награда "Лучший сервис доставки"' },
    { year: '2023', event: 'Открытие второй кухни' },
    { year: '2024', event: '10,000+ довольных клиентов' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">О нас</h1>
            <p className="text-xl opacity-90 mb-8">
              Мы создаем не просто еду - мы создаем впечатления и заботимся о каждом клиенте
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm opacity-80">Лет на рынке</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm opacity-80">Блюд в меню</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-sm opacity-80">Довольных клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-sm opacity-80">Рейтинг сервиса</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* История компании */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Наша история</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg"
                  alt="История компании"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  Наша история началась в 2020 году с простой идеи - сделать качественную еду доступной каждому. 
                  Мы начинали как небольшая семейная кухня, но благодаря вашей поддержке выросли в надежный 
                  сервис доставки еды.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Сегодня мы гордимся тем, что можем предложить широкий выбор блюд, приготовленных с любовью 
                  и заботой о качестве. Каждое блюдо проходит строгий контроль качества, а наши повара 
                  постоянно совершенствуют рецепты.
                </p>
                <p className="text-lg text-gray-600">
                  Мы не останавливаемся на достигнутом и продолжаем развиваться, внедряя новые технологии 
                  и расширяя ассортимент, чтобы радовать вас еще больше.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Миссия и ценности */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши ценности</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Принципы, которыми мы руководствуемся в работе каждый день
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наша команда</h2>
            <p className="text-gray-600">Профессионалы, которые создают ваши любимые блюда</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge className="mb-2">{member.position}</Badge>
                  <p className="text-sm text-orange-600 mb-3">{member.experience}</p>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Партнеры и поставщики */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши партнеры</h2>
            <p className="text-gray-600">Надежные поставщики качественных продуктов</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                  <Badge variant="outline" className="mb-3">{partner.type}</Badge>
                  <p className="text-gray-600 text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Достижения */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши достижения</h2>
            <p className="text-gray-600">Ключевые вехи в развитии компании</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-orange-200"></div>
              
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="p-4">
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-orange-600 mb-2">{achievement.year}</div>
                        <p className="text-gray-700">{achievement.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к нашей семье</h2>
          <p className="text-xl mb-8 opacity-90">
            Станьте частью истории качественной еды и отличного сервиса
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Попробовать наши блюда
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;