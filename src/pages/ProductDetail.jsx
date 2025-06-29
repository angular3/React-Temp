import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Users,
  Award,
  Leaf,
  Wheat,
  ShoppingCart,
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';
import apiService from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Заглушка для демонстрации
  const mockProduct = {
    _id: id,
    name: 'Пицца Маргарита',
    description: 'Классическая итальянская пицца с томатным соусом, моцареллой и свежим базиликом. Приготовлена на тонком тесте в дровяной печи.',
    price: 850,
    category: { _id: '1', name: 'Пицца' },
    images: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg',
      'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg'
    ],
    ingredients: ['Тесто', 'Томатный соус', 'Моцарелла', 'Базилик', 'Оливковое масло'],
    weight: 450,
    calories: 890,
    cookingTime: 15,
    servings: 2,
    isAvailable: true,
    isPopular: true,
    isVegan: false,
    isVegetarian: true,
    isGlutenFree: false,
    rating: 4.8,
    reviewsCount: 127,
    nutritionFacts: {
      proteins: 28,
      fats: 32,
      carbs: 85,
      fiber: 4,
      sugar: 8,
      sodium: 1200
    },
    allergens: ['Глютен', 'Молочные продукты'],
    storageInstructions: 'Хранить в холодильнике не более 2 дней',
    reheatingInstructions: 'Разогреть в духовке при 180°C в течение 5-7 минут'
  };

  const mockReviews = [
    {
      _id: '1',
      user: { name: 'Анна Петрова', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face' },
      rating: 5,
      comment: 'Отличная пицца! Тесто тонкое, ингредиенты свежие. Доставили быстро и горячую.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      helpful: 12,
      images: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg']
    },
    {
      _id: '2',
      user: { name: 'Михаил Сидоров', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face' },
      rating: 4,
      comment: 'Вкусно, но хотелось бы больше базилика. В целом рекомендую!',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      helpful: 8
    },
    {
      _id: '3',
      user: { name: 'Елена Козлова', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face' },
      rating: 5,
      comment: 'Лучшая пицца в городе! Заказываю уже не первый раз, качество всегда на высоте.',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      helpful: 15
    }
  ];

  const mockRelatedProducts = [
    {
      _id: '2',
      name: 'Пицца Пепперони',
      price: 950,
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      rating: 4.7,
      reviewsCount: 89,
      isPopular: true,
      isAvailable: true,
      category: { name: 'Пицца' }
    },
    {
      _id: '3',
      name: 'Пицца Четыре сыра',
      price: 1100,
      image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg',
      rating: 4.9,
      reviewsCount: 156,
      isPopular: true,
      isAvailable: true,
      category: { name: 'Пицца' }
    },
    {
      _id: '4',
      name: 'Пицца Гавайская',
      price: 1050,
      image: 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg',
      rating: 4.5,
      reviewsCount: 73,
      isPopular: false,
      isAvailable: true,
      category: { name: 'Пицца' }
    }
  ];

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет API запрос
      // const productData = await apiService.getProduct(id);
      // const relatedData = await apiService.getProducts({ category: productData.category._id, limit: 4 });
      // const reviewsData = await apiService.getProductReviews(id);
      
      setProduct(mockProduct);
      setRelatedProducts(mockRelatedProducts);
      setReviews(mockReviews);
    } catch (error) {
      console.error('Ошибка загрузки продукта:', error);
      toast.error('Ошибка загрузки продукта');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${product.name} добавлен в корзину (${quantity} шт.)`);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleImageChange = (direction) => {
    if (!product?.images) return;
    
    if (direction === 'next') {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт, чтобы добавить в избранное');
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Ошибка при попытке поделиться:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ссылка скопирована в буфер обмена');
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт, чтобы оставить отзыв');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Напишите комментарий');
      return;
    }

    try {
      // В реальном приложении здесь будет API запрос
      // await apiService.createReview(id, newReview);
      
      const review = {
        _id: Date.now().toString(),
        user: { name: 'Вы', avatar: null },
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
        helpful: 0
      };

      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewDialog(false);
      toast.success('Отзыв добавлен');
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      toast.error('Ошибка добавления отзыва');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Продукт не найден</h1>
          <Button onClick={() => navigate('/products')}>
            Вернуться к каталогу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-600">Главная</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-600">Меню</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category._id}`} className="hover:text-orange-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Кнопка назад */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        {/* Основная информация о продукте */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Галерея изображений */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {/* Навигация по изображениям */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageChange('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageChange('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Индикаторы изображений */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}

              {/* Бейджи */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.isPopular && (
                  <Badge className="bg-orange-500">Популярное</Badge>
                )}
                {product.isVegetarian && (
                  <Badge className="bg-green-500">
                    <Leaf className="w-3 h-3 mr-1" />
                    Вегетарианское
                  </Badge>
                )}
                {product.isGlutenFree && (
                  <Badge className="bg-blue-500">
                    <Wheat className="w-3 h-3 mr-1" />
                    Без глютена
                  </Badge>
                )}
              </div>
            </div>

            {/* Миниатюры */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      index === selectedImageIndex ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Информация о продукте */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            {/* Рейтинг и отзывы */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="font-medium ml-2">{product.rating}</span>
              </div>
              <span className="text-gray-600">
                ({product.reviewsCount} отзывов)
              </span>
            </div>

            {/* Цена */}
            <div className="text-3xl font-bold text-orange-600">
              {formatPrice(product.price)}
            </div>

            {/* Основные характеристики */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{product.cookingTime} мин</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{product.servings} порции</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{product.weight}г</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">🔥</span>
                <span className="text-sm">{product.calories} ккал</span>
              </div>
            </div>

            {/* Количество и добавление в корзину */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Количество:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.isAvailable ? 
                    `Добавить в корзину • ${formatPrice(product.price * quantity)}` : 
                    'Нет в наличии'
                  }
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Детальная информация */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="ingredients">Состав</TabsTrigger>
                <TabsTrigger value="nutrition">Пищевая ценность</TabsTrigger>
                <TabsTrigger value="storage">Хранение</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">О блюде</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description} Это блюдо готовится нашими опытными поварами 
                    из отборных ингредиентов. Мы используем только свежие продукты 
                    и следуем традиционным рецептам, чтобы обеспечить неповторимый вкус.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <div className="font-medium">{product.cookingTime} мин</div>
                      <div className="text-sm text-gray-600">Время приготовления</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <div className="font-medium">{product.servings}</div>
                      <div className="text-sm text-gray-600">Порций</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Award className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <div className="font-medium">{product.weight}г</div>
                      <div className="text-sm text-gray-600">Вес</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-3xl mb-2 block">🔥</span>
                      <div className="font-medium">{product.calories}</div>
                      <div className="text-sm text-gray-600">Калорий</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ingredients" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Состав</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Ингредиенты:</h4>
                      <ul className="space-y-2">
                        {product.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Аллергены:</h4>
                      <div className="space-y-2">
                        {product.allergens.map((allergen, index) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        {product.isVegetarian && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <Leaf className="w-4 h-4" />
                            <span className="text-sm">Вегетарианское блюдо</span>
                          </div>
                        )}
                        {product.isGlutenFree && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Wheat className="w-4 h-4" />
                            <span className="text-sm">Не содержит глютен</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Пищевая ценность на 100г</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{product.nutritionFacts.proteins}г</div>
                      <div className="text-sm text-gray-600">Белки</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{product.nutritionFacts.fats}г</div>
                      <div className="text-sm text-gray-600">Жиры</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{product.nutritionFacts.carbs}г</div>
                      <div className="text-sm text-gray-600">Углеводы</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{product.nutritionFacts.fiber}г</div>
                      <div className="text-sm text-gray-600">Клетчатка</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{product.nutritionFacts.sugar}г</div>
                      <div className="text-sm text-gray-600">Сахар</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{product.nutritionFacts.sodium}мг</div>
                      <div className="text-sm text-gray-600">Натрий</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Энергетическая ценность</h4>
                    <div className="text-lg">
                      <span className="font-bold">{Math.round(product.calories / product.weight * 100)} ккал</span>
                      <span className="text-gray-600 ml-2">на 100г</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Общая калорийность порции: {product.calories} ккал
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="storage" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Условия хранения и разогрева</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <span className="text-lg mr-2">❄️</span>
                        Хранение
                      </h4>
                      <p className="text-sm text-gray-700">{product.storageInstructions}</p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <span className="text-lg mr-2">🔥</span>
                        Разогрев
                      </h4>
                      <p className="text-sm text-gray-700">{product.reheatingInstructions}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium mb-2 text-yellow-800">⚠️ Важно</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Не оставляйте блюдо при комнатной температуре более 2 часов</li>
                      <li>• Разогревайте только один раз</li>
                      <li>• Убедитесь, что блюдо полностью разогрето перед употреблением</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Отзывы */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Отзывы ({reviews.length})
              </CardTitle>
              <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">Написать отзыв</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Написать отзыв</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Оценка</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newReview.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Комментарий</label>
                      <Textarea
                        placeholder="Поделитесь своим мнением о блюде..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleSubmitReview}>
                        Опубликовать
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>
                        {review.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{review.user.name}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2 mb-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Отзыв ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Полезно ({review.helpful})</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
                          <ThumbsDown className="w-4 h-4" />
                          <span>Не полезно</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Связанные товары */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Похожие блюда</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;