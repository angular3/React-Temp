import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedItems = localStorage.getItem('savedForLater');
    const recentItems = localStorage.getItem('recentlyViewed');
    
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedItems) {
      setSavedForLater(JSON.parse(savedItems));
    }
    if (recentItems) {
      setRecentlyViewed(JSON.parse(recentItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addItem = (product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0],
        quantity,
        category: product.category,
        weight: product.weight,
        calories: product.calories
      }];
    });
  };

  const removeItem = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalWeight = () => {
    return items.reduce((total, item) => total + ((item.weight || 0) * item.quantity), 0);
  };

  const getTotalCalories = () => {
    return items.reduce((total, item) => total + ((item.calories || 0) * item.quantity), 0);
  };

  const saveForLater = (productId) => {
    const item = items.find(item => item.id === productId);
    if (item) {
      setSavedForLater(prev => [...prev, item]);
      removeItem(productId);
    }
  };

  const moveToCart = (productId) => {
    const item = savedForLater.find(item => item.id === productId);
    if (item) {
      addItem(item, item.quantity);
      setSavedForLater(prev => prev.filter(item => item.id !== productId));
    }
  };

  const removeSavedItem = (productId) => {
    setSavedForLater(prev => prev.filter(item => item.id !== productId));
  };

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product._id);
      return [product, ...filtered].slice(0, 10); // Храним только последние 10
    });
  };

  const isInCart = (productId) => {
    return items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items,
    savedForLater,
    recentlyViewed,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getTotalWeight,
    getTotalCalories,
    saveForLater,
    moveToCart,
    removeSavedItem,
    addToRecentlyViewed,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};