import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Gift, 
  Percent, 
  Clock,
  Truck,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  QrCode,
  Apple,
  Wallet,
  Building,
  Calculator,
  Tag,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Состояния для корзины
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [giftWrap, setGiftWrap] = useState(false);
  const [saveForLater, setSaveForLater] = useState([]);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

  // Доступные промокоды
  const availablePromoCodes = [
    { code: 'WELCOME20', discount: 20, type: 'percentage', description: 'Скидка 20% для новых клиентов' },
    { code: 'DELIVERY50', discount: 50, type: 'fixed', description: 'Скидка 50₽ на доставку' },
    { code: 'COMBO15', discount: 15, type: 'percentage', description: 'Скидка 15% на комбо' },
    { code: 'WEEKEND10', discount: 10, type: 'percentage', description: 'Скидка 10% на выходных' }
  ];

  // Методы оплаты
  const paymentMethods = [
    {
      id: 'card',
      name: 'Банковская карта',
      description: 'Visa, MasterCard, МИР',
      icon: <CreditCard className="w-5 h-5" />,
      fee: 0,
      popular: true
    },
    {
      id: 'sbp',
      name: 'СБП',
      description: 'Система быстрых платежей',
      icon: <Smartphone className="w-5 h-5" />,
      fee: 0,
      popular: true
    },
    {
      id: 'cash',
      name: 'Наличные',
      description: 'Оплата курьеру',
      icon: <Banknote className="w-5 h-5" />,
      fee: 0
    },
    {
      id: 'qr',
      name: 'QR-код',
      description: 'Оплата по QR-коду',
      icon: <QrCode className="w-5 h-5" />,
      fee: 0
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Быстрая оплата',
      icon: <Apple className="w-5 h-5" />,
      fee: 0
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Быстрая оплата',
      icon: <Wallet className="w-5 h-5" />,
      fee: 0
    },
    {
      id: 'yandex_pay',
      name: 'Yandex Pay',
      description: 'Быстрая оплата',
      icon: <Wallet className="w-5 h-5" />,
      fee: 0
    },
    {
      id: 'bank_transfer',
      name: 'Банковский перевод',
      description: 'Перевод на счет',
      icon: <Building className="w-5 h-5" />,
      fee: 0
    },
    {
      id: 'installment',
      name: 'Рассрочка',
      description: 'Оплата частями',
      icon: <Calculator className="w-5 h-5" />,
      fee: 0,
      minAmount: 1000
    }
  ];

  // Варианты доставки
  const deliveryOptions = [
    {
      id: 'delivery',
      name: 'Доставка',
      description: 'Доставим по адресу',
      icon: <Truck className="w-5 h-5" />,
      time: '30-45 мин',
      price: 200,
      freeFrom: 1000
    },
    {
      id: 'pickup',
      name: 'Самовывоз',
      description: 'Заберите сами',
      icon: <MapPin className="w-5 h-5" />,
      time: '15-20 мин',
      price: 0
    }
  ];

  // Варианты времени доставки
  const deliveryTimeOptions = [
    { id: 'asap', name: 'Как можно скорее', description: '30-45 мин' },
    { id: 'scheduled', name: 'Запланировать', description: 'Выберите время' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Расчет скидки
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const subtotal = getTotalPrice();
    if (appliedPromo.type === 'percentage') {
      return Math.round(subtotal * appliedPromo.discount / 100);
    } else {
      return Math.min(appliedPromo.discount, subtotal);
    }
  };

  // Расчет стоимости доставки
  const calculateDeliveryFee = () => {
    if (deliveryMethod === 'pickup') return 0;
    
    const deliveryOption = deliveryOptions.find(opt => opt.id === deliveryMethod);
    const subtotal = getTotalPrice();
    
    if (subtotal >= deliveryOption.freeFrom) return 0;
    return deliveryOption.price;
  };

  // Расчет комиссии за оплату
  const calculatePaymentFee = () => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
    return method?.fee || 0;
  };

  // Расчет стоимости подарочной упаковки
  const calculateGiftWrapFee = () => {
    return giftWrap ? 50 : 0;
  };

  // Итоговая сумма
  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const discount = calculateDiscount();
    const deliveryFee = calculateDeliveryFee();
    const paymentFee = calculatePaymentFee();
    const giftWrapFee = calculateGiftWrapFee();
    
    return subtotal - discount + deliveryFee + paymentFee + giftWrapFee;
  };

  // Применение промокода
  const applyPromoCode = () => {
    const promo = availablePromoCodes.find(p => p.code === promoCode.toUpperCase());
    
    if (!promo) {
      toast.error('Промокод не найден');
      return;
    }

    if (appliedPromo?.code === promo.code) {
      toast.error('Промокод уже применен');
      return;
    }

    setAppliedPromo(promo);
    setPromoCode('');
    toast.success(`Промокод применен! Скидка: ${promo.type === 'percentage' ? `${promo.discount}%` : formatPrice(promo.discount)}`);
  };

  // Удаление промокода
  const removePromoCode = () => {
    setAppliedPromo(null);
    toast.success('Промокод удален');
  };

  // Сохранить на потом
  const handleSaveForLater = (itemId) => {
    setSaveForLater([...saveForLater, itemId]);
    removeItem(itemId);
    toast.success('Товар сохранен на потом');
  };

  // Переместить обратно в корзину
  const moveBackToCart = (itemId) => {
    setSaveForLater(saveForLater.filter(id => id !== itemId));
    // Здесь нужно добавить логику для возврата товара в корзину
    toast.success('Товар возвращен в корзину');
  };

  // Поделиться корзиной
  const shareCart = async () => {
    const cartData = {
      items: items.map(item => ({ name: item.name, quantity: item.quantity })),
      total: formatPrice(calculateTotal())
    };
    
    const shareText = `Моя корзина в ВкусноЕда:\n${cartData.items.map(item => `${item.name} x${item.quantity}`).join('\n')}\nИтого: ${cartData.total}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Моя корзина',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Ошибка при попытке поделиться:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Корзина скопирована в буфер обмена');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Проверка минимальной суммы для рассрочки
    if (selectedPaymentMethod === 'installment' && calculateTotal() < 1000) {
      toast.error('Минимальная сумма для рассрочки: 1000₽');
      return;
    }

    // Передача данных в checkout
    const checkoutData = {
      items,
      paymentMethod: selectedPaymentMethod,
      deliveryMethod,
      deliveryTime,
      promoCode: appliedPromo,
      giftWrap,
      total: calculateTotal()
    };

    navigate('/checkout', { state: checkoutData });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ваша корзина пуста</h2>
            <p className="text-gray-600 mb-8">
              Добавьте блюда из нашего меню, чтобы сделать заказ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/products">Перейти к меню</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/promotions">Посмотреть акции</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Корзина ({items.length})</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={shareCart}>
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </Button>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Очистить
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Товары в корзине */}
          <div className="xl:col-span-2 space-y-6">
            {/* Основные товары */}
            <Card>
              <CardHeader>
                <CardTitle>Ваши блюда</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-orange-600 font-medium">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveForLater(item.id)}
                            className="text-gray-600 hover:text-orange-600"
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            Сохранить
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="w-12 text-center font-medium text-lg">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="font-semibold text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-0 h-auto mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Промокод */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Промокод
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-800">{appliedPromo.code}</div>
                        <div className="text-sm text-green-600">{appliedPromo.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600">
                        -{appliedPromo.type === 'percentage' ? `${appliedPromo.discount}%` : formatPrice(appliedPromo.discount)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button onClick={applyPromoCode} disabled={!promoCode.trim()}>
                        Применить
                      </Button>
                    </div>
                    
                    <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Percent className="w-4 h-4 mr-2" />
                          Доступные промокоды
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Доступные промокоды</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {availablePromoCodes.map((promo) => (
                            <div key={promo.code} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-mono font-bold text-orange-600">{promo.code}</div>
                                <Badge>
                                  -{promo.type === 'percentage' ? `${promo.discount}%` : formatPrice(promo.discount)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{promo.description}</p>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setPromoCode(promo.code);
                                  setShowPromoDialog(false);
                                }}
                              >
                                Использовать
                              </Button>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Дополнительные опции */}
            <Card>
              <CardHeader>
                <CardTitle>Дополнительные услуги</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gift-wrap"
                      checked={giftWrap}
                      onCheckedChange={setGiftWrap}
                    />
                    <Label htmlFor="gift-wrap" className="flex items-center space-x-2">
                      <Gift className="w-4 h-4" />
                      <span>Подарочная упаковка</span>
                    </Label>
                  </div>
                  <span className="font-medium">{formatPrice(50)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Сводка заказа */}
          <div className="space-y-6">
            {/* Способ доставки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Доставка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  {deliveryOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {option.icon}
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                              <div className="text-sm text-gray-500">{option.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            {option.price === 0 ? (
                              <Badge className="bg-green-600">Бесплатно</Badge>
                            ) : getTotalPrice() >= option.freeFrom ? (
                              <div>
                                <div className="line-through text-gray-400">{formatPrice(option.price)}</div>
                                <Badge className="bg-green-600">Бесплатно</Badge>
                              </div>
                            ) : (
                              <span className="font-medium">{formatPrice(option.price)}</span>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {deliveryMethod === 'delivery' && getTotalPrice() < 1000 && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Добавьте еще {formatPrice(1000 - getTotalPrice())} для бесплатной доставки
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Время доставки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Время {deliveryMethod === 'delivery' ? 'доставки' : 'готовности'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryTimeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="popular">Популярные</TabsTrigger>
                    <TabsTrigger value="digital">Цифровые</TabsTrigger>
                    <TabsTrigger value="other">Другие</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="popular" className="space-y-2 mt-4">
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      {paymentMethods.filter(method => method.popular).map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {method.icon}
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-gray-600">{method.description}</div>
                                </div>
                              </div>
                              {method.fee > 0 && (
                                <span className="text-sm text-gray-500">+{formatPrice(method.fee)}</span>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </TabsContent>
                  
                  <TabsContent value="digital" className="space-y-2 mt-4">
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      {paymentMethods.filter(method => ['apple_pay', 'google_pay', 'yandex_pay', 'qr'].includes(method.id)).map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center space-x-2">
                              {method.icon}
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-gray-600">{method.description}</div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </TabsContent>
                  
                  <TabsContent value="other" className="space-y-2 mt-4">
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      {paymentMethods.filter(method => ['bank_transfer', 'installment'].includes(method.id)).map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem 
                            value={method.id} 
                            id={method.id}
                            disabled={method.minAmount && calculateTotal() < method.minAmount}
                          />
                          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {method.icon}
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-gray-600">{method.description}</div>
                                  {method.minAmount && calculateTotal() < method.minAmount && (
                                    <div className="text-xs text-red-600">
                                      Минимум: {formatPrice(method.minAmount)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Итоговая сводка */}
            <Card>
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Стоимость блюд:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка ({appliedPromo.code}):</span>
                      <span>-{formatPrice(calculateDiscount())}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>
                      {calculateDeliveryFee() === 0 ? (
                        <span className="text-green-600">Бесплатно</span>
                      ) : (
                        formatPrice(calculateDeliveryFee())
                      )}
                    </span>
                  </div>

                  {giftWrap && (
                    <div className="flex justify-between">
                      <span>Подарочная упаковка:</span>
                      <span>{formatPrice(calculateGiftWrapFee())}</span>
                    </div>
                  )}

                  {calculatePaymentFee() > 0 && (
                    <div className="flex justify-between">
                      <span>Комиссия за оплату:</span>
                      <span>{formatPrice(calculatePaymentFee())}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>К оплате:</span>
                    <span className="text-orange-600">{formatPrice(calculateTotal())}</span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Время {deliveryMethod === 'delivery' ? 'доставки' : 'готовности'}: {deliveryTimeOptions.find(opt => opt.id === deliveryTime)?.description}</p>
                    <p>• Мы свяжемся с вами для подтверждения</p>
                    <p>• {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</p>
                  </div>

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Оформить заказ
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/products">Продолжить покупки</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Безопасность */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Безопасная оплата SSL</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Гарантия возврата средств</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Рекомендации */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Рекомендуем добавить</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Здесь будут рекомендуемые товары */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <img
                  src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg"
                  alt="Напиток"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium mb-1">Кола 0.5л</h3>
                <p className="text-orange-600 font-bold">{formatPrice(150)}</p>
                <Button size="sm" className="w-full mt-2">
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;