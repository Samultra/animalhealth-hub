
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Database, Settings } from 'lucide-react';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';

const AdminPanel: React.FC = () => {
  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Управление пользователями</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Создание, редактирование и удаление учетных записей пользователей.
                  Назначение ролей и разрешений.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Управление ролями</CardTitle>
                <Shield className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Настройка ролей и разрешений в системе. 
                  Определение доступа к функциям и данным.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Аудит системы</CardTitle>
                <Database className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Просмотр логов и истории действий пользователей.
                  Мониторинг безопасности системы.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Настройки системы</CardTitle>
                <Settings className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Общие настройки системы, параметры работы и конфигурация.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Статистика системы</CardTitle>
                <CardDescription>
                  Общие показатели активности и состояния системы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-lg font-bold">125</div>
                    <div className="text-sm text-muted-foreground">Пользователей</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-lg font-bold">347</div>
                    <div className="text-sm text-muted-foreground">Животных</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-lg font-bold">1,284</div>
                    <div className="text-sm text-muted-foreground">Записей</div>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="text-lg font-bold">98.2%</div>
                    <div className="text-sm text-muted-foreground">Активность</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default AdminPanel;
