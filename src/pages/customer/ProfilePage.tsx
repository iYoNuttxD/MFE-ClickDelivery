import React, { useEffect, useState } from 'react';
import { userApi } from '@/entities/user/api/userApi';
import { UserProfile } from '@/entities/user/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { useAuth } from '@/shared/hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fallback to auth user data
        if (authUser) {
          setProfile({
            id: authUser.sub,
            email: authUser.email || '',
            name: authUser.name || '',
            roles: authUser.roles,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div>Perfil não encontrado</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-lg">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <p className="mt-1 text-lg">{profile.phone || 'Não informado'}</p>
          </div>
          {profile.address && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <p className="mt-1 text-lg">
                {profile.address.street}, {profile.address.city} - {profile.address.state}
              </p>
            </div>
          )}
        </div>
        <button className="mt-6 bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600">
          Editar Perfil
        </button>
      </div>
    </div>
  );
};
