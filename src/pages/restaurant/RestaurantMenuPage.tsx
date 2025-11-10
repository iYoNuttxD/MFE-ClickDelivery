import React, { useEffect, useState } from 'react';
import { restaurantApi } from '@/entities/restaurant/api/restaurantApi';
import { MenuItem } from '@/entities/restaurant/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { useToast } from '@/shared/ui/components/Toast';
import { useAuth } from '@/shared/auth/useAuth';
import { config } from '@/shared/config/env';

export const RestaurantMenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true,
  });
  const toast = useToast();
  const { user } = useAuth();

  // In internal mode, use a mock restaurant ID for the current user
  // In production, this would come from the user's restaurant association
  const restaurantId = config.useInternalMode 
    ? (localStorage.getItem('internal_mode_restaurant_id') || 'rest-1')
    : user?.restaurantId || '';

  const fetchMenuItems = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      const items = await restaurantApi.getMenuItems(restaurantId);
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      toast.error('Erro ao carregar itens do cardápio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const handleCreate = async () => {
    if (!restaurantId) return;
    
    try {
      const newItem = await restaurantApi.createMenuItem(restaurantId, formData);
      setMenuItems([...menuItems, newItem]);
      toast.success('Item criado com sucesso!');
      setIsCreating(false);
      setFormData({ name: '', description: '', price: 0, category: '', available: true });
    } catch (error) {
      console.error('Failed to create menu item:', error);
      toast.error('Erro ao criar item');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    
    try {
      const updated = await restaurantApi.updateMenuItem(editingItem.id, formData);
      setMenuItems(menuItems.map(item => item.id === updated.id ? updated : item));
      toast.success('Item atualizado com sucesso!');
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, category: '', available: true });
    } catch (error) {
      console.error('Failed to update menu item:', error);
      toast.error('Erro ao atualizar item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      await restaurantApi.deleteMenuItem(id);
      setMenuItems(menuItems.filter(item => item.id !== id));
      toast.success('Item excluído com sucesso!');
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updated = await restaurantApi.updateMenuItem(item.id, { 
        available: !item.available 
      });
      setMenuItems(menuItems.map(i => i.id === updated.id ? updated : i));
      toast.success(`Item ${updated.available ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      toast.error('Erro ao atualizar disponibilidade');
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
      imageUrl: item.imageUrl,
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({ name: '', description: '', price: 0, category: '', available: true });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cardápio</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600"
        >
          + Adicionar Item
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingItem) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? 'Criar Novo Item' : 'Editar Item'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
              <input
                type="text"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Disponível</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={isCreating ? handleCreate : handleUpdate}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {isCreating ? 'Criar' : 'Salvar'}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Menu Items List */}
      {menuItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">Nenhum item no cardápio. Adicione o primeiro!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <p className="text-lg font-bold mt-2 text-primary-600">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded ml-4" />
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => startEdit(item)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`flex-1 py-2 rounded ${
                    item.available
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {item.available ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
