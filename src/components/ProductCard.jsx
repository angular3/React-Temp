import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product._id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image || product.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isPopular && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              Популярное
            </Badge>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive">Нет в наличии</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {product.rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviewsCount})</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {product.weight}г • {product.calories} ккал
            </div>
          </div>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500">
                Состав: {product.ingredients.slice(0, 3).join(', ')}
                {product.ingredients.length > 3 && '...'}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-bold text-orange-600">
              {formatPrice(product.price)}
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              В корзину
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;