
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import PageTransition from '@/components/layout/PageTransition';
import { PawPrint } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при входе",
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
            <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
            <CardDescription>
              Войдите в свой аккаунт для доступа к системе мониторинга здоровья животных
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Нет аккаунта?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Демо учетные записи:
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="bg-muted p-2 rounded">
                  <div className="font-bold">Админ</div>
                  <div>admin@example.com</div>
                  <div>admin123</div>
                </div>
                <div className="bg-muted p-2 rounded">
                  <div className="font-bold">Модератор</div>
                  <div>moderator@example.com</div>
                  <div>moderator123</div>
                </div>
                <div className="bg-muted p-2 rounded">
                  <div className="font-bold">Пользователь</div>
                  <div>user@example.com</div>
                  <div>user123</div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
