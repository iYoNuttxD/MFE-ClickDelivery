/**
 * Tests for internal mode storage
 */

import { InternalStorage, clearAllInternalStorage } from '@/shared/internal-mode/storage';

describe('InternalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should store and retrieve data', () => {
    const storage = new InternalStorage<{ name: string }>('test');
    
    storage.set('1', { name: 'Test Item' });
    
    const item = storage.get('1');
    expect(item).toEqual({ name: 'Test Item' });
  });

  it('should return all stored items', () => {
    const storage = new InternalStorage<{ name: string }>('test');
    
    storage.set('1', { name: 'Item 1' });
    storage.set('2', { name: 'Item 2' });
    
    const items = storage.getAll();
    expect(items).toHaveLength(2);
    expect(items).toContainEqual({ name: 'Item 1' });
    expect(items).toContainEqual({ name: 'Item 2' });
  });

  it('should update existing items', () => {
    const storage = new InternalStorage<{ name: string; count: number }>('test');
    
    storage.set('1', { name: 'Item', count: 0 });
    storage.update('1', item => ({ ...item, count: item.count + 1 }));
    
    const item = storage.get('1');
    expect(item).toEqual({ name: 'Item', count: 1 });
  });

  it('should delete items', () => {
    const storage = new InternalStorage<{ name: string }>('test');
    
    storage.set('1', { name: 'Item' });
    const deleted = storage.delete('1');
    
    expect(deleted).toBe(true);
    expect(storage.get('1')).toBeUndefined();
  });

  it('should clear all items', () => {
    const storage = new InternalStorage<{ name: string }>('test');
    
    storage.set('1', { name: 'Item 1' });
    storage.set('2', { name: 'Item 2' });
    storage.clear();
    
    expect(storage.getAll()).toHaveLength(0);
  });

  it('should work without localStorage when not available', () => {
    // Create storage with localStorage disabled
    const storage = new InternalStorage<{ name: string }>('test', false);
    
    storage.set('1', { name: 'Memory Item' });
    
    const item = storage.get('1');
    expect(item).toEqual({ name: 'Memory Item' });
    
    // Verify nothing was stored in localStorage
    expect(localStorage.getItem('internal_mode_test')).toBeNull();
  });

  it('should persist data across instances when localStorage is enabled', () => {
    const storage1 = new InternalStorage<{ name: string }>('test');
    storage1.set('1', { name: 'Persisted Item' });
    
    // Create new instance with same key
    const storage2 = new InternalStorage<{ name: string }>('test');
    const item = storage2.get('1');
    
    expect(item).toEqual({ name: 'Persisted Item' });
  });

  it('should handle clearAllInternalStorage gracefully', () => {
    const storage1 = new InternalStorage<{ name: string }>('test1');
    const storage2 = new InternalStorage<{ name: string }>('test2');
    
    storage1.set('1', { name: 'Item 1' });
    storage2.set('1', { name: 'Item 2' });
    
    // Clear all internal storage
    clearAllInternalStorage();
    
    // Create new instances to verify data is cleared
    const newStorage1 = new InternalStorage<{ name: string }>('test1');
    const newStorage2 = new InternalStorage<{ name: string }>('test2');
    
    expect(newStorage1.size()).toBe(0);
    expect(newStorage2.size()).toBe(0);
  });
});
