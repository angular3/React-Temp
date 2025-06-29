import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  QrCode, 
  Apple, 
  Wallet, 
  Building, 
  Calculator,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

const PaymentMethods = ({ 
  selectedMethod, 
  onMethodChange, 
  totalAmount, 
  onPaymentDataChange 
}) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [installmentPlan, setInstallmentPlan] = useState('3');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Банковская карта',
      description: 'Visa, MasterCard, МИР',
      icon: <CreditCard className="w-5 h-5" />,
      fee: 0,
      popular: true,
      secure: true
    },
    {
      id: 'sbp',
      name: 'СБП',
      description: 'Система быстрых платежей',
      icon: <Smartphone className="w-5 h-5" />,
      fee: 0,
      popular: true,
      instant: true
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Touch ID или Face ID',
      icon: <Apple className="w-5 h-5" />,
      fee: 0,
      instant: true
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Быстрая оплата',
      icon: <Wallet className="w-5 h-5" />,
      fee: 0,
      instant: true
    },
    {
      id: 'yandex_pay',
      name: 'Yandex Pay',
      description: 'Оплата одним касанием',
      icon: <Wallet className="w-5 h-5" />,
      fee: 0,
      instant: true
    },
    {
      id: 'qr',
      name: 'QR-код',
      description: 'Сканирование QR-кода',
      icon: <QrCode className="w-5 h-5" />,
      fee: 0
    },
    {
      id: 'cash',
      name: 'Наличные',
      description: 'Оплата курьеру при получении',
      icon: <Banknote className="w-5 h-5" />,
      fee: 0,
      cashOnly: true
    },
    {
      id: 'bank_transfer',
      name: 'Банковский перевод',
      description: 'Перевод на расчетный счет',
      icon: <Building className="w-5 h-5" />,
      fee: 0,
      delayed: true
    },
    {
      id: 'installment',
      name: 'Рассрочка',
      description: 'Оплата частями без переплат',
      icon: <Calculator className="w-5 h-5" />,
      fee: 0,
      minAmount: 1000
    }
  ];

  const installmentPlans = [
    { months: '3', description: '3 месяца', monthlyPayment: Math.round(totalAmount / 3) },
    { months: '6', description: '6 месяцев', monthlyPayment: Math.round(totalAmount / 6) },
    { months: '12', description: '12 месяцев', monthlyPayment: Math.round(totalAmount / 12) }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardDataChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 3);
    }
    
    const newCardData = { ...cardData, [field]: formattedValue };
    setCardData(newCardData);
    onPaymentDataChange?.({ type: 'card', data: newCardData });
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="card-number">Номер карты</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleCardDataChange('number', e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Срок действия</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => handleCardDataChange('expiry', e.target.value)}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => handleCardDataChange('cvv', e.target.value)}
                  maxLength={3}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="card-name">Имя держателя карты</Label>
              <Input
                id="card-name"
                placeholder="IVAN PETROV"
                value={cardData.name}
                onChange={(e) => handleCardDataChange('name', e.target.value.toUpperCase())}
              />
            </div>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Ваши данные защищены SSL-шифрованием и не сохраняются на наших серверах
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'installment':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <Label>Выберите план рассрочки</Label>
              <RadioGroup value={installmentPlan} onValueChange={setInstallmentPlan}>
                {installmentPlans.map((plan) => (
                  <div key={plan.months} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={plan.months} id={`plan-${plan.months}`} />
                    <Label htmlFor={`plan-${plan.months}`} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{plan.description}</div>
                          <div className="text-sm text-gray-600">Без переплат и комиссий</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatPrice(plan.monthlyPayment)}</div>
                          <div className="text-sm text-gray-600">в месяц</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Рассрочка предоставляется без процентов и скрытых комиссий
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'sbp':
        return (
          <div className="space-y-4 mt-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                После подтверждения заказа вы получите ссылку для оплаты через СБП
              </AlertDescription>
            </Alert>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Как оплатить через СБП:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Откройте приложение вашего банка</li>
                <li>Выберите "Оплата по QR" или "СБП"</li>
                <li>Отсканируйте QR-код или перейдите по ссылке</li>
                <li>Подтвердите платеж</li>
              </ol>
            </div>
          </div>
        );

      case 'cash':
        return (
          <div className="space-y-4 mt-4">
            <Alert>
              <Banknote className="h-4 w-4" />
              <AlertDescription>
                Оплата производится курьеру наличными при получении заказа
              </AlertDescription>
            </Alert>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2">Важно:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Приготовьте точную сумму: {formatPrice(totalAmount)}</li>
                <li>Курьер может не иметь сдачи с крупных купюр</li>
                <li>При отказе от заказа может взиматься штраф</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Способ оплаты
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="popular">Популярные</TabsTrigger>
            <TabsTrigger value="digital">Цифровые</TabsTrigger>
            <TabsTrigger value="other">Другие</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular" className="space-y-3 mt-4">
            <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
              {paymentMethods.filter(method => method.popular).map((method) => (
                <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {method.icon}
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{method.name}</span>
                            {method.secure && <Badge variant="outline" className="text-xs">Безопасно</Badge>}
                            {method.instant && <Badge variant="outline" className="text-xs">Мгновенно</Badge>}
                          </div>
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
          
          <TabsContent value="digital" className="space-y-3 mt-4">
            <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
              {paymentMethods.filter(method => ['apple_pay', 'google_pay', 'yandex_pay', 'qr', 'sbp'].includes(method.id)).map((method) => (
                <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      {method.icon}
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{method.name}</span>
                          {method.instant && <Badge variant="outline" className="text-xs">Мгновенно</Badge>}
                        </div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="other" className="space-y-3 mt-4">
            <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
              {paymentMethods.filter(method => ['cash', 'bank_transfer', 'installment'].includes(method.id)).map((method) => (
                <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem 
                    value={method.id} 
                    id={method.id}
                    disabled={method.minAmount && totalAmount < method.minAmount}
                  />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      {method.icon}
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{method.name}</span>
                          {method.cashOnly && <Badge variant="outline" className="text-xs">Наличные</Badge>}
                          {method.delayed && <Badge variant="outline" className="text-xs">1-3 дня</Badge>}
                        </div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                        {method.minAmount && totalAmount < method.minAmount && (
                          <div className="text-xs text-red-600">
                            Минимальная сумма: {formatPrice(method.minAmount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
        </Tabs>

        {renderPaymentForm()}

        {/* Информация о безопасности */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Безопасная оплата</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>SSL-шифрование данных</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>PCI DSS сертификация</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Защита от мошенничества</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;