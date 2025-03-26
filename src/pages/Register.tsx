
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import { PawPrint } from 'lucide-react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пароли не совпадают",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(username, email, password);
      toast({
        title: "Успешная регистрация",
        description: "Ваша учетная запись создана, и вы вошли в систему",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex justify-center mb-4">
              <PawPrint className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
            <CardDescription>
              Создайте аккаунт для доступа к системе мониторинга здоровья животных
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Имя пользователя
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Иван Иванов"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Пароль
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Подтверждение пароля
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <div className="w-full text-sm">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Войти
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Register;
