
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';

const Unauthorized: React.FC = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
        <ShieldX className="h-24 w-24 text-destructive mb-6" />
        <h1 className="text-4xl font-bold tracking-tight">Доступ запрещен</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          У вас нет необходимых прав для доступа к этой странице.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Вернуться на главную</Link>
        </Button>
      </div>
    </PageTransition>
  );
};

export default Unauthorized;
