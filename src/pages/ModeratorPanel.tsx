
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, AlertTriangle, Eye, FileCheck } from 'lucide-react';
import RoleBasedNavbar from '@/components/layout/RoleBasedNavbar';

const ModeratorPanel: React.FC = () => {
  return (
    <>
      <RoleBasedNavbar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Панель модератора</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Проверка данных</CardTitle>
                <ClipboardList className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Проверка и подтверждение внесенных данных о животных.
                  Верификация информации о здоровье.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Работа с инцидентами</CardTitle>
                <AlertTriangle className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Обработка сообщений об инцидентах и проблемах.
                  Реагирование на уведомления системы.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Мониторинг активности</CardTitle>
                <Eye className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Наблюдение за активностью пользователей.
                  Выявление подозрительной активности.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Отчетность</CardTitle>
                <FileCheck className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mt-2">
                  Формирование и проверка отчетов.
                  Анализ данных о состоянии животных.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Очередь задач</CardTitle>
                <CardDescription>
                  Задачи, требующие внимания модератора
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">Проверка новых записей</h3>
                      <p className="text-sm text-muted-foreground">12 новых записей требуют проверки</p>
                    </div>
                    <div className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      В ожидании
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">Инцидент #124</h3>
                      <p className="text-sm text-muted-foreground">Требуется подтверждение обработки инцидента</p>
                    </div>
                    <div className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      Срочно
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">Еженедельный отчет</h3>
                      <p className="text-sm text-muted-foreground">Подготовка отчета за текущую неделю</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      В процессе
                    </div>
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

export default ModeratorPanel;
