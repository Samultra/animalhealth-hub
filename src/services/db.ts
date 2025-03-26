
import { openDB, deleteDB } from 'idb';

export const initDB = async () => {
  const db = await openDB('animalHealth', 1, {
    upgrade(db) {
      // Создаем хранилище пользователей
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        userStore.createIndex('email', 'email', { unique: true });
        userStore.createIndex('username', 'username', { unique: false });
      }
      
      // Создаем хранилище животных
      if (!db.objectStoreNames.contains('animals')) {
        const animalStore = db.createObjectStore('animals', { keyPath: 'id', autoIncrement: true });
        animalStore.createIndex('userId', 'userId', { unique: false });
        animalStore.createIndex('name', 'name', { unique: false });
        animalStore.createIndex('species', 'species', { unique: false });
      }
      
      // Создаем хранилище для жизненных показателей
      if (!db.objectStoreNames.contains('vitalSigns')) {
        const vitalSignsStore = db.createObjectStore('vitalSigns', { keyPath: 'id', autoIncrement: true });
        vitalSignsStore.createIndex('animalId', 'animalId', { unique: false });
        vitalSignsStore.createIndex('date', 'date', { unique: false });
      }
      
      // Создаем хранилище для лекарств
      if (!db.objectStoreNames.contains('medications')) {
        const medicationsStore = db.createObjectStore('medications', { keyPath: 'id', autoIncrement: true });
        medicationsStore.createIndex('animalId', 'animalId', { unique: false });
        medicationsStore.createIndex('status', 'status', { unique: false });
      }
      
      // Создаем хранилище для активностей
      if (!db.objectStoreNames.contains('activities')) {
        const activitiesStore = db.createObjectStore('activities', { keyPath: 'id', autoIncrement: true });
        activitiesStore.createIndex('animalId', 'animalId', { unique: false });
        activitiesStore.createIndex('date', 'date', { unique: false });
        activitiesStore.createIndex('type', 'type', { unique: false });
      }
    },
  });
  
  return db;
};

export const initDemoData = async () => {
  const db = await openDB('animalHealth', 1);
  
  // Проверяем, есть ли уже пользователи в базе
  const userCount = await db.count('users');
  if (userCount === 0) {
    // Добавляем демо пользователей
    await db.add('users', {
      email: 'admin@example.com',
      username: 'Администратор',
      password: 'admin123', // В реальном приложении пароли должны быть хешированы
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    await db.add('users', {
      email: 'moderator@example.com',
      username: 'Модератор',
      password: 'moderator123',
      role: 'moderator',
      createdAt: new Date().toISOString()
    });
    
    await db.add('users', {
      email: 'user@example.com',
      username: 'Пользователь',
      password: 'user123',
      role: 'user',
      createdAt: new Date().toISOString()
    });
  }
  
  // Проверяем, есть ли уже животные в базе
  const animalCount = await db.count('animals');
  if (animalCount === 0) {
    // Добавляем демо животных для пользователя
    const user = await db.getFromIndex('users', 'email', 'user@example.com');
    
    if (user) {
      // Первое животное
      const animal1Id = await db.add('animals', {
        userId: user.id,
        name: 'Барсик',
        species: 'Кот',
        breed: 'Сибирская',
        age: 5,
        weight: 5.2,
        temperature: 38.3,
        heartRate: 95,
        healthStatus: 'good',
        lastCheckup: '2023-10-15',
        imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=200&h=200'
      });
      
      // Второе животное
      const animal2Id = await db.add('animals', {
        userId: user.id,
        name: 'Рекс',
        species: 'Собака',
        breed: 'Немецкая овчарка',
        age: 3,
        weight: 32.5,
        temperature: 38.7,
        heartRate: 85,
        healthStatus: 'excellent',
        lastCheckup: '2023-11-02',
        imageUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=200&h=200'
      });
      
      // Добавим немного истории показателей для Барсика
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(oneMonthAgo.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        
        await db.add('vitalSigns', {
          animalId: animal1Id,
          temperature: 38 + (Math.random() * 1.2 - 0.6), // 37.4-39.2
          heartRate: 90 + Math.floor(Math.random() * 20 - 10), // 80-110
          weight: 5 + (Math.random() * 0.6 - 0.3), // 4.7-5.3
          date: date.toISOString()
        });
      }
      
      // Добавим немного истории показателей для Рекса
      for (let i = 0; i < 5; i++) {
        const date = new Date(oneMonthAgo.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        
        await db.add('vitalSigns', {
          animalId: animal2Id,
          temperature: 38.5 + (Math.random() * 0.8 - 0.4), // 38.1-39.3
          heartRate: 85 + Math.floor(Math.random() * 20 - 10), // 75-105
          weight: 32 + (Math.random() * 1.4 - 0.7), // 31.3-33.7
          date: date.toISOString()
        });
      }
      
      // Добавим лекарства для животных
      await db.add('medications', {
        animalId: animal1Id,
        name: 'Витамины',
        dosage: '1 таблетка',
        frequency: 'daily',
        startDate: '2023-10-15',
        endDate: '2023-11-15',
        status: 'active'
      });
      
      await db.add('medications', {
        animalId: animal1Id,
        name: 'Антибиотик',
        dosage: '5 мл',
        frequency: 'twice-daily',
        startDate: '2023-10-20',
        endDate: '2023-10-30',
        status: 'completed'
      });
      
      await db.add('medications', {
        animalId: animal2Id,
        name: 'Витамины',
        dosage: '2 таблетки',
        frequency: 'daily',
        startDate: '2023-10-10',
        endDate: '2023-11-10',
        status: 'active'
      });
      
      // Добавим активности для животных
      const activities = [
        { type: 'walk', duration: '30 минут', intensity: 'medium' },
        { type: 'play', duration: '15 минут', intensity: 'high' },
        { type: 'training', duration: '20 минут', intensity: 'medium' },
        { type: 'grooming', duration: '10 минут', intensity: 'low' },
        { type: 'vet-visit', duration: '45 минут', intensity: 'medium' }
      ];
      
      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i * 2);
        
        await db.add('activities', {
          animalId: animal1Id,
          ...activities[i % activities.length],
          date: date.toISOString()
        });
        
        const date2 = new Date();
        date2.setDate(date2.getDate() - i * 3);
        
        await db.add('activities', {
          animalId: animal2Id,
          ...activities[(i + 2) % activities.length],
          date: date2.toISOString()
        });
      }
    }
  }
};

export const resetDB = async () => {
  await deleteDB('animalHealth');
  await initDB();
  await initDemoData();
};
