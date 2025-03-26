
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import AdminPanel from "./pages/AdminPanel";
import ModeratorPanel from "./pages/ModeratorPanel";
import AnimalForm from "./pages/AnimalForm";
import AnimalDetails from "./pages/AnimalDetails";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import React, { useEffect, useState } from "react";
import { initDB, initDemoData } from "./services/db";

const queryClient = new QueryClient();

const App = () => {
  const [dbInitialized, setDbInitialized] = useState(false);
  
  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
        await initDemoData();
        setDbInitialized(true);
      } catch (error) {
        console.error("Ошибка инициализации базы данных:", error);
      }
    };
    
    init();
  }, []);
  
  if (!dbInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-4">Инициализация базы данных...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Защищенные маршруты */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
              <Route path="/animals/add" element={
                <ProtectedRoute>
                  <AnimalForm />
                </ProtectedRoute>
              } />
              
              <Route path="/animals/:id" element={
                <ProtectedRoute>
                  <AnimalDetails />
                </ProtectedRoute>
              } />
              
              {/* Маршруты только для администраторов */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRoles="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } />
              
              {/* Маршруты для модераторов и администраторов */}
              <Route path="/moderator" element={
                <ProtectedRoute requiredRoles={["moderator", "admin"]}>
                  <ModeratorPanel />
                </ProtectedRoute>
              } />
              
              {/* Редирект на главную страницу с 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
