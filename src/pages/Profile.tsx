
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { Save, User, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState<string>(user?.username || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // В реальном приложении здесь будет API запрос на обновление профиля
    setTimeout(() => {
      toast.success('Профиль успешно обновлен');
      setLoading(false);
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    
    setLoading(true);
    
    // В реальном приложении здесь будет API запрос на смену пароля
    setTimeout(() => {
      toast.success('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Профиль пользователя</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 border-2 border-white shadow-md mb-4">
                      <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
                    <p className="text-gray-500 mb-2">{user?.email}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {user?.role === "admin" && (
                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>Администратор</span>
                        </div>
                      )}
                      {user?.role === "moderator" && (
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>Модератор</span>
                        </div>
                      )}
                      {user?.role === "user" && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Пользователь</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Выйти</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile">
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Основная информация</TabsTrigger>
                  <TabsTrigger value="security">Безопасность</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Профиль</CardTitle>
                      <CardDescription>
                        Управление вашей персональной информацией
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="username" className="text-sm font-medium">
                            Имя пользователя
                          </label>
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                              Сохранение...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" /> 
                              Сохранить изменения
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Безопасность</CardTitle>
                      <CardDescription>
                        Управление паролем и настройками безопасности
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="currentPassword" className="text-sm font-medium">
                            Текущий пароль
                          </label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="newPassword" className="text-sm font-medium">
                            Новый пароль
                          </label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Подтверждение пароля
                          </label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                              Сохранение...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" /> 
                              Изменить пароль
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Profile;
