import React, { useState } from 'react';
import { Tag, Percent, Gift, Clock, Users, CheckCircle, X, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';

const PromoCodeManager = ({ 
  appliedPromo, 
  onApplyPromo, 
  onRemovePromo, 
  totalAmount 
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [showAvailablePromos, setShowAvailablePromos] = useState(false);

  // Доступные промокоды
  const availablePromoCodes = [
    {
      code: 'WELCOME20',
      discount: 20,
      type: 'percentage',
      description: 'Скидка 20% для новых клиентов',
      minAmount: 500,
      maxDiscount: 500,
      validUntil: '2024-12-31',
      category: 'new_user'
    },
    {
      code: 'DELIVERY50',
      discount: 50,
      type: 'fixed',
      description: 'Скидка 50₽ на доставку',
      minAmount: 300,
      validUntil: '2024-12-31',
      category: 'delivery'
    },
    {
      code: 'COMBO15',
      discount: 15,
      type: 'percentage',
      description: 'Скидка 15% на комбо-наборы',
      minAmount: 800,
      maxDiscount: 300,
      validUntil: '2024-12-31',
      category: 'combo'
    },
    {
      code: 'WEEKEND10',
      discount: 10,
      type: 'percentage',
      description: 'Скидка 10% на выходных',
      minAmount: 600,
      maxDiscount: 200,
      validUntil: '2024-12-31',
      category: 'weekend'
    },
    {
      code: 'BIRTHDAY25',
      discount: 25,
      type: 'percentage',
      description: 'Скидка 25% в день рождения',
      minAmount: 1000,
      maxDiscount: 1000,
      validUntil: '2024-12-31',
      category: 'birthday'
    },
    {
      code: 'STUDENT15',
      discount: 15,
      type: 'percentage',
      description: 'Скидка 15% для студентов',
      minAmount: 400,
      maxDiscount: 300,
      validUntil: '2024-12-31',
      category: 'student'
    },
    {
      code: 'FAMILY200',
      discount: 200,
      type: 'fixed',
      description: 'Скидка 200₽ на семейные заказы',
      minAmount: 1500,
      validUntil: '2024-12-31',
      category: 'family'
    },
    {
      code: 'MIDNIGHT30',
      discount: 30,
      type: 'percentage',
      description: 'Скидка 30% на ночные заказы (23:00-06:00)',
      minAmount: 500,
      maxDiscount: 400,
      validUntil: '2024-12-31',
      category: 'night'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (promo) => {
    if (promo.type === 'percentage') {
      const discount = Math.round(totalAmount * promo.discount / 100);
      return promo.maxDiscount ? Math.min(discount, promo.maxDiscount) : discount;
    } else {
      return Math.min(promo.discount, totalAmount);
    }
  };

  const isPromoValid = (promo) => {
    return totalAmount >= promo.minAmount;
  };

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

    if (!isPromoValid(promo)) {
      toast.error(`Минимальная сумма заказа для этого промокода: ${formatPrice(promo.minAmount)}`);
      return;
    }

    onApplyPromo(promo);
    setPromoCode('');
    toast.success(`Промокод применен! Скидка: ${formatPrice(calculateDiscount(promo))}`);
  };

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Промокод скопирован');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'new_user': return <Users className="w-4 h-4" />;
      case 'delivery': return <Gift className="w-4 h-4" />;
      case 'combo': return <Percent className="w-4 h-4" />;
      case 'weekend': return <Clock className="w-4 h-4" />;
      case 'birthday': return <Gift className="w-4 h-4" />;
      case 'student': return <Users className="w-4 h-4" />;
      case 'family': return <Users className="w-4 h-4" />;
      case 'night': return <Clock className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'new_user': return 'bg-blue-500';
      case 'delivery': return 'bg-green-500';
      case 'combo': return 'bg-purple-500';
      case 'weekend': return 'bg-orange-500';
      case 'birthday': return 'bg-pink-500';
      case 'student': return 'bg-indigo-500';
      case 'family': return 'bg-teal-500';
      case 'night': return 'bg-gray-700';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="w-5 h-5 mr-2" />
          Промокод
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appliedPromo ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getCategoryColor(appliedPromo.category)} text-white`}>
                {getCategoryIcon(appliedPromo.category)}
              </div>
              <div>
                <div className="font-mono font-bold text-green-800">{appliedPromo.code}</div>
                <div className="text-sm text-green-600">{appliedPromo.description}</div>
                <div className="text-xs text-green-500">
                  Скидка: {formatPrice(calculateDiscount(appliedPromo))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-600">
                -{appliedPromo.type === 'percentage' ? `${appliedPromo.discount}%` : formatPrice(appliedPromo.discount)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemovePromo}
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
                className="flex-1 font-mono"
                onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
              />
              <Button onClick={applyPromoCode} disabled={!promoCode.trim()}>
                Применить
              </Button>
            </div>
            
            <Dialog open={showAvailablePromos} onOpenChange={setShowAvailablePromos}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Percent className="w-4 h-4 mr-2" />
                  Доступные промокоды ({availablePromoCodes.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Доступные промокоды</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {availablePromoCodes.map((promo) => {
                    const isValid = isPromoValid(promo);
                    const discount = calculateDiscount(promo);
                    
                    return (
                      <div 
                        key={promo.code} 
                        className={`p-4 border rounded-lg ${isValid ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${getCategoryColor(promo.category)} text-white`}>
                              {getCategoryIcon(promo.category)}
                            </div>
                            <div>
                              <div className="font-mono font-bold text-lg">{promo.code}</div>
                              <div className="text-sm text-gray-600">{promo.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={isValid ? 'bg-green-600' : 'bg-gray-400'}>
                              -{promo.type === 'percentage' ? `${promo.discount}%` : formatPrice(promo.discount)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyPromoCode(promo.code)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Минимальная сумма:</span>
                            <div className="font-medium">{formatPrice(promo.minAmount)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Ваша скидка:</span>
                            <div className="font-medium text-green-600">
                              {isValid ? formatPrice(discount) : 'Недоступно'}
                            </div>
                          </div>
                          {promo.maxDiscount && (
                            <div>
                              <span className="text-gray-500">Максимальная скидка:</span>
                              <div className="font-medium">{formatPrice(promo.maxDiscount)}</div>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Действует до:</span>
                            <div className="font-medium">{new Date(promo.validUntil).toLocaleDateString('ru-RU')}</div>
                          </div>
                        </div>

                        {!isValid && (
                          <Alert className="mt-3">
                            <AlertDescription>
                              Добавьте еще {formatPrice(promo.minAmount - totalAmount)} для использования этого промокода
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex justify-end mt-3">
                          <Button
                            size="sm"
                            disabled={!isValid}
                            onClick={() => {
                              setPromoCode(promo.code);
                              setShowAvailablePromos(false);
                            }}
                          >
                            {isValid ? 'Использовать' : 'Недоступно'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>

            {/* Подсказки */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>💡 Промокоды можно найти в наших социальных сетях</div>
              <div>🎁 Следите за акциями и получайте эксклюзивные скидки</div>
              <div>📧 Подпишитесь на рассылку для получения персональных предложений</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromoCodeManager;