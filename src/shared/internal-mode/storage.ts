/**
 * Storage utilities for internal mode
 * Provides in-memory and localStorage-backed storage for mock data
 */

const STORAGE_PREFIX = 'internal_mode_';

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return false;
    }
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export class InternalStorage<T> {
  private storageKey: string;
  private memoryCache: Map<string, T> = new Map();
  private useLocalStorage: boolean;

  constructor(key: string, useLocalStorage = true) {
    this.storageKey = `${STORAGE_PREFIX}${key}`;
    this.useLocalStorage = useLocalStorage && isLocalStorageAvailable();
    
    // Load from localStorage on initialization
    if (this.useLocalStorage) {
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.memoryCache = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    if (!this.useLocalStorage) return;
    
    try {
      const obj = Object.fromEntries(this.memoryCache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(obj));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  set(id: string, value: T): void {
    this.memoryCache.set(id, value);
    this.saveToLocalStorage();
  }

  get(id: string): T | undefined {
    return this.memoryCache.get(id);
  }

  getAll(): T[] {
    return Array.from(this.memoryCache.values());
  }

  delete(id: string): boolean {
    const result = this.memoryCache.delete(id);
    this.saveToLocalStorage();
    return result;
  }

  update(id: string, updater: (value: T) => T): T | undefined {
    const current = this.memoryCache.get(id);
    if (current) {
      const updated = updater(current);
      this.memoryCache.set(id, updated);
      this.saveToLocalStorage();
      return updated;
    }
    return undefined;
  }

  clear(): void {
    this.memoryCache.clear();
    this.saveToLocalStorage();
  }

  has(id: string): boolean {
    return this.memoryCache.has(id);
  }

  size(): number {
    return this.memoryCache.size;
  }
}

export const clearAllInternalStorage = (): void => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, skipping clear operation');
    return;
  }
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing internal storage:', error);
  }
};
