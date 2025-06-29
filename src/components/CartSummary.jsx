import React from 'react';
import { Calculator, Truck, Gift, CreditCard, Tag, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

const CartSummary = ({
  subtotal,
  discount = 0,
  deliveryFee = 0,
  paymentFee = 0,
  giftWrapFee = 0,
  taxes = 0,
  total,
  appliedPromo = null,
  deliveryMethod = 'delivery',
  paymentMethod = 'card',
  freeDeliveryThreshold = 1000,
  showDetails = true
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const savings = discount;
  const isEligibleForFreeDelivery = subtotal >= freeDeliveryThreshold;
  const amountNeededForFreeDelivery = freeDeliveryThreshold - subtotal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Итого к оплате
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Основные позиции */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Стоимость блюд:</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Скидка {appliedPromo ? `(${appliedPromo.code})` : ''}:</span>
              </div>
              <span className="font-medium">-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {deliveryMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}:
              </span>
            </div>
            <span className="font-medium">
              {deliveryFee === 0 ? (
                <span className="text-green-600">Бесплатно</span>
              ) : (
                formatPrice(deliveryFee)
              )}
            </span>
          </div>

          {giftWrapFee > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Подарочная упаковка:</span>
              </div>
              <span className="font-medium">{formatPrice(giftWrapFee)}</span>
            </div>
          )}

          {paymentFee > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Комиссия за оплату:</span>
              </div>
              <span className="font-medium">{formatPrice(paymentFee)}</span>
            </div>
          )}

          {taxes > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">НДС (включен):</span>
              <span className="font-medium">{formatPrice(taxes)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Итоговая сумма */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>К оплате:</span>
          <span className="text-orange-600">{formatPrice(total)}</span>
        </div>

        {/* Экономия */}
        {savings > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-green-800 font-medium">Ваша экономия:</span>
              <span className="text-green-600 font-bold">{formatPrice(savings)}</span>
            </div>
          </div>
        )}

        {/* Уведомление о бесплатной доставке */}
        {deliveryMethod === 'delivery' && !isEligibleForFreeDelivery && amountNeededForFreeDelivery > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Добавьте еще {formatPrice(amountNeededForFreeDelivery)} для бесплатной доставки
            </AlertDescription>
          </Alert>
        )}

        {/* Детали заказа */}
        {showDetails && (
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Время {deliveryMethod === 'delivery' ? 'доставки' : 'готовности'}: 30-45 мин</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Мы свяжемся с вами для подтверждения</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Безопасная оплата SSL</span>
            </div>
          </div>
        )}

        {/* Программа лояльности */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">Бонусы за заказ:</span>
            <Badge className="bg-blue-600">+{Math.round(total * 0.05)} ₽</Badge>
          </div>
          <div className="text-xs text-blue-600">
            Получите 5% от суммы заказа бонусами для следующих покупок
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;