
import { getDB } from './db';

export interface Animal {
  id?: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: string;
  createdAt: string;
  imageUrl?: string;
}

// Получение всех животных пользователя
export const getUserAnimals = async (userId: string) => {
  const db = await getDB();
  const animalIndex = db.transaction('animals').store.index('by-owner');
  return animalIndex.getAll(userId);
};

// Получение одного животного по ID
export const getAnimalById = async (id: number) => {
  const db = await getDB();
  return db.get('animals', id);
};

// Создание нового животного
export const createAnimal = async (animal: Animal) => {
  const db = await getDB();
  const tx = db.transaction('animals', 'readwrite');
  const id = await tx.store.add({
    ...animal,
    createdAt: new Date().toISOString()
  });
  await tx.done;
  return id;
};

// Обновление информации о животном
export const updateAnimal = async (id: number, data: Partial<Animal>) => {
  const db = await getDB();
  const tx = db.transaction('animals', 'readwrite');
  const animal = await tx.store.get(id);
  
  if (!animal) {
    throw new Error('Животное не найдено');
  }
  
  const updatedAnimal = { ...animal, ...data };
  await tx.store.put(updatedAnimal);
  await tx.done;
  return updatedAnimal;
};

// Удаление животного
export const deleteAnimal = async (id: number) => {
  const db = await getDB();
  const tx = db.transaction('animals', 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};
