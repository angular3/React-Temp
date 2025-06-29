import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: 'recipes', label: 'Рецепты' },
    { value: 'nutrition', label: 'Питание' },
    { value: 'news', label: 'Новости' },
    { value: 'health', label: 'Здоровье' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Секреты приготовления идеальной пиццы дома',
      excerpt: 'Узнайте, как приготовить пиццу ресторанного качества на своей кухне. Делимся профессиональными секретами наших поваров.',
      content: 'Полный рецепт и пошаговые инструкции...',
      category: 'recipes',
      author: 'Александр Иванов',
      date: '2024-01-15',
      readTime: '8 мин',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      tags: ['пицца', 'рецепт', 'итальянская кухня']
    },
    {
      id: 2,
      title: 'Польза средиземноморской диеты: научные факты',
      excerpt: 'Исследования показывают, что средиземноморская диета может значительно улучшить здоровье сердца и общее самочувствие.',
      content: 'Подробный анализ пользы средиземноморской диеты...',
      category: 'nutrition',
      author: 'Мария Петрова',
      date: '2024-01-12',
      readTime: '6 мин',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      tags: ['диета', 'здоровье', 'питание']
    },
    {
      id: 3,
      title: 'Новое меню: азиатские блюда в ВкусноЕда',
      excerpt: 'Мы расширили наше меню новыми блюдами азиатской кухни. Попробуйте аутентичные вкусы Азии с доставкой на дом.',
      content: 'Обзор новых блюд азиатской кухни...',
      category: 'news',
      author: 'Команда ВкусноЕда',
      date: '2024-01-10',
      readTime: '4 мин',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      tags: ['новости', 'азиатская кухня', 'меню']
    },
    {
      id: 4,
      title: '10 продуктов для укрепления иммунитета',
      excerpt: 'Какие продукты помогут укрепить иммунную систему в холодное время года. Составляем правильный рацион.',
      content: 'Список продуктов для иммунитета...',
      category: 'health',
      author: 'Дмитрий Сидоров',
      date: '2024-01-08',
      readTime: '5 мин',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      tags: ['иммунитет', 'здоровье', 'витамины']
    },
    {
      id: 5,
      title: 'Как правильно хранить продукты: гид по свежести',
      excerpt: 'Простые правила хранения продуктов, которые помогут сохранить их свежесть и питательные свойства дольше.',
      content: 'Подробное руководство по хранению продуктов...',
      category: 'nutrition',
      author: 'Елена Козлова',
      date: '2024-01-05',
      readTime: '7 мин',
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
      tags: ['хранение', 'продукты', 'советы']
    },
    {
      id: 6,
      title: 'Веганские альтернативы: вкусно и полезно',
      excerpt: 'Обзор лучших веганских альтернатив традиционным продуктам. Как сделать растительное питание разнообразным.',
      content: 'Гид по веганским продуктам...',
      category: 'nutrition',
      author: 'Анна Волкова',
      date: '2024-01-03',
      readTime: '6 мин',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      tags: ['веганство', 'растительное питание', 'здоровье']
    }
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  const filteredPosts = regularPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Блог ВкусноЕда</h1>
            <p className="text-xl opacity-90 mb-8">
              Рецепты, советы по питанию, новости и всё о здоровой еде
            </p>
          </div>
        </div>
      </section>

      {/* Поиск и фильтры */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Поиск статей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все категории</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Главная статья */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-500">
                    Рекомендуем
                  </Badge>
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline">
                      {getCategoryLabel(featuredPost.category)}
                    </Badge>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(featuredPost.date)}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">{featuredPost.author}</span>
                    </div>
                    <Button>
                      Читать далее
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Список статей */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Последние статьи</h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Статьи не найдены</h3>
                <p className="text-gray-600">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4" variant="secondary">
                        {getCategoryLabel(post.category)}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">{post.author}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Читать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Подписка на новости */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Не пропустите новые статьи</h2>
          <p className="text-xl mb-8 opacity-90">
            Подпишитесь на нашу рассылку и получайте свежие рецепты и советы по питанию
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

export default Blog;