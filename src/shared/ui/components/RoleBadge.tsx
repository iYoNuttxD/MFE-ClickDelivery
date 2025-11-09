import React from 'react';
import { useTranslation } from 'react-i18next';

interface RoleBadgeProps {
  role: string;
}

const roleColors: Record<string, string> = {
  customer: 'bg-blue-100 text-blue-800',
  restaurant: 'bg-green-100 text-green-800',
  courier: 'bg-yellow-100 text-yellow-800',
  owner: 'bg-purple-100 text-purple-800',
  admin: 'bg-red-100 text-red-800',
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const { t } = useTranslation();
  const colorClass = roleColors[role] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {t(`roles.${role}`, role)}
    </span>
  );
};
