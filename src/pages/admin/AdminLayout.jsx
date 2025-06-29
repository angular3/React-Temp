import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogOut,
  Home,
  FolderOpen
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../components/ThemeProvider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '../../components/ui/sidebar';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Проверка прав администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    {
      title: 'Панель управления',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true
    },
    {
      title: 'Продукты',
      icon: Package,
      path: '/admin/products'
    },
    {
      title: 'Категории',
      icon: FolderOpen,
      path: '/admin/categories'
    },
    {
      title: 'Заказы',
      icon: ShoppingCart,
      path: '/admin/orders'
    },
    {
      title: 'Пользователи',
      icon: Users,
      path: '/admin/users'
    },
    {
      title: 'Настройки',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center space-x-2 px-4 py-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍕</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">ВкусноЕда</h2>
                <p className="text-xs text-muted-foreground">Админ панель</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path, item.exact);
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path} className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Тема</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-9 h-9 p-0"
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    На сайт
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="flex-1"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-9 h-9 p-0"
                >
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;