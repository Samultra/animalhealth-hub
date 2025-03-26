
import { openDB, DBSchema } from 'idb';
import { User } from '../types/auth';

// Определяем схему базы данных
interface AnimalDBSchema extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  animals: {
    key: number;
    value: {
      id?: number;
      name: string;
      species: string;
      breed: string;
      age: number;
      weight: number;
      ownerId: string;
      createdAt: string;
      imageUrl?: string;
      temperature?: string;
      heartRate?: string;
      healthStatus?: "excellent" | "good" | "average" | "poor" | "critical";
      lastCheckup?: string;
    };
    indexes: { 'by-owner': string };
  };
  vitalSigns: {
    key: number;
    value: {
      id?: number;
      animalId: number;
      type: 'temperature' | 'heartRate' | 'weight';
      value: number;
      date: string;
      notes?: string;
    };
    indexes: { 'by-animal': number; 'by-type': string };
  };
  medications: {
    key: number;
    value: {
      id?: number;
      animalId: number;
      name: string;
      schedule: string;
      dosage: string;
      status: 'active' | 'completed' | 'cancelled' | 'upcoming';
      lastTaken: string;
      nextDue: string;
    };
    indexes: { 'by-animal': number; 'by-status': string };
  };
  activities: {
    key: number;
    value: {
      id?: number;
      animalId: number;
      type: string;
      description: string;
      timestamp: string;
      status: 'pending' | 'completed' | 'cancelled';
    };
    indexes: { 'by-animal': number; 'by-status': string };
  };
}

// Инициализация базы данных
export const initDB = async () => {
  const db = await openDB<AnimalDBSchema>('animalHealthDB', 1, {
    upgrade(db) {
      // Создание таблицы пользователей
      const userStore = db.createObjectStore('users', { keyPath: 'id' });
      userStore.createIndex('by-email', 'email', { unique: true });

      // Создание таблицы животных
      const animalStore = db.createObjectStore('animals', { keyPath: 'id', autoIncrement: true });
      animalStore.createIndex('by-owner', 'ownerId');

      // Создание таблицы жизненных показателей
      const vitalSignsStore = db.createObjectStore('vitalSigns', { keyPath: 'id', autoIncrement: true });
      vitalSignsStore.createIndex('by-animal', 'animalId');
      vitalSignsStore.createIndex('by-type', 'type');

      // Создание таблицы лекарств
      const medicationsStore = db.createObjectStore('medications', { keyPath: 'id', autoIncrement: true });
      medicationsStore.createIndex('by-animal', 'animalId');
      medicationsStore.createIndex('by-status', 'status');

      // Создание таблицы активностей
      const activitiesStore = db.createObjectStore('activities', { keyPath: 'id', autoIncrement: true });
      activitiesStore.createIndex('by-animal', 'animalId');
      activitiesStore.createIndex('by-status', 'status');
    },
  });

  return db;
};

// Получение инстанса базы данных
export const getDB = () => {
  return openDB<AnimalDBSchema>('animalHealthDB', 1);
};

// Функция для инициализации демо-данных
export const initDemoData = async () => {
  const db = await getDB();

  // Проверяем, есть ли уже данные
  const usersCount = await db.count('users');
  if (usersCount > 0) {
    return; // Данные уже инициализированы
  }

  // Добавляем демо пользователей
  const users = [
    {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      role: "admin" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      username: "модератор",
      email: "moderator@example.com",
      role: "moderator" as const,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      username: "пользователь",
      email: "user@example.com",
      role: "user" as const,
      createdAt: new Date().toISOString(),
    },
  ];

  const tx = db.transaction('users', 'readwrite');
  for (const user of users) {
    await tx.store.add(user);
  }
  await tx.done;

  // Добавляем демо животных
  const animals = [
    {
      name: "Барсик",
      species: "Кошка",
      breed: "Сиамская",
      age: 3,
      weight: 4.5,
      ownerId: "3",
      createdAt: new Date().toISOString(),
      imageUrl: "/placeholder.svg",
      temperature: "38.5°C",
      heartRate: "120",
      healthStatus: "good" as "excellent" | "good" | "average" | "poor" | "critical",
      lastCheckup: new Date().toISOString()
    },
    {
      name: "Шарик",
      species: "Собака",
      breed: "Лабрадор",
      age: 5,
      weight: 25.2,
      ownerId: "3",
      createdAt: new Date().toISOString(),
      imageUrl: "/placeholder.svg",
      temperature: "38.0°C",
      heartRate: "80",
      healthStatus: "excellent" as "excellent" | "good" | "average" | "poor" | "critical",
      lastCheckup: new Date().toISOString()
    }
  ];

  const animalTx = db.transaction('animals', 'readwrite');
  for (const animal of animals) {
    await animalTx.store.add(animal);
  }
  await animalTx.done;

  // Здесь можно добавить демо-данные для других таблиц
};
