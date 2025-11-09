/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      common: {
        loading: 'Carregando...',
        error: 'Erro',
        save: 'Salvar',
        cancel: 'Cancelar',
        delete: 'Excluir',
        edit: 'Editar',
        create: 'Criar',
        search: 'Pesquisar',
        filter: 'Filtrar',
      },
      auth: {
        login: 'Entrar',
        logout: 'Sair',
        register: 'Cadastrar',
        email: 'Email',
        password: 'Senha',
        welcomeBack: 'Bem-vindo de volta!',
      },
      nav: {
        dashboard: 'Dashboard',
        orders: 'Pedidos',
        profile: 'Perfil',
        settings: 'Configurações',
        restaurants: 'Restaurantes',
        deliveries: 'Entregas',
        vehicles: 'Veículos',
        rentals: 'Aluguéis',
        users: 'Usuários',
        reports: 'Relatórios',
        audit: 'Auditoria',
      },
      roles: {
        customer: 'Cliente',
        restaurant: 'Restaurante',
        courier: 'Entregador',
        owner: 'Proprietário',
        admin: 'Administrador',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default i18n;
