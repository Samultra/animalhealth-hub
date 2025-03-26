
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PawPrint, User, Settings, Bell, Shield, Users, Database, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RoleBasedNavbar: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <PawPrint className="h-8 w-8 text-primary" />
                <span className="font-medium text-xl">AnimalHealth</span>
              </div>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              <Link to="/" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md font-medium">
                Главная
              </Link>
              
              {/* Ссылки для всех аутентифицированных пользователей */}
              <Link to="/animals" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md font-medium">
                Животные
              </Link>
              
              {/* Ссылки для модераторов и администраторов */}
              {hasRole(["admin", "moderator"]) && (
                <Link to="/reports" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md font-medium">
                  Отчеты
                </Link>
              )}
              
              {/* Ссылки только для администраторов */}
              {hasRole("admin") && (
                <>
                  <Link to="/users" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md font-medium">
                    Пользователи
                  </Link>
                  <Link to="/settings" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md font-medium">
                    Настройки системы
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 flex h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            {hasRole("admin") && (
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-gray-100 shadow-sm">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center mt-1">
                      {user?.role === "admin" && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                          Администратор
                        </span>
                      )}
                      {user?.role === "moderator" && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          Модератор
                        </span>
                      )}
                      {user?.role === "user" && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          Пользователь
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Профиль</span>
                  </Link>
                </DropdownMenuItem>
                {hasRole("admin") && (
                  <DropdownMenuItem asChild>
                    <Link to="/users" className="cursor-pointer flex w-full items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Управление пользователями</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {hasRole(["admin", "moderator"]) && (
                  <DropdownMenuItem asChild>
                    <Link to="/reports" className="cursor-pointer flex w-full items-center">
                      <Database className="mr-2 h-4 w-4" />
                      <span>Отчеты</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedNavbar;
