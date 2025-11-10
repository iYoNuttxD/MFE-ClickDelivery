/**
 * Seed Restaurants
 * Creates sample restaurants, menus, and menu items for development environment
 */

import axios from 'axios';

const API_URL = process.env.SEED_API_URL || process.env.VITE_API_BASE_URL || 'https://cd-apim-gateway.azure-api.net/api/v1';

interface RestaurantSeed {
  name: string;
  description: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
}

const restaurants: RestaurantSeed[] = [
  {
    name: 'Pizzaria Bella Italia',
    description: 'Pizzas artesanais com massa fina e ingredientes selecionados',
    category: 'Italiana',
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    phone: '(11) 98765-4321',
  },
  {
    name: 'Burger House',
    description: 'Os melhores hambúrgueres artesanais da cidade',
    category: 'Hambúrguer',
    address: {
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01311-100',
    },
    phone: '(11) 91234-5678',
  },
  {
    name: 'Sushi Express',
    description: 'Comida japonesa fresca e de qualidade',
    category: 'Japonesa',
    address: {
      street: 'Rua dos Pinheiros, 500',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05422-001',
    },
    phone: '(11) 93456-7890',
  },
  {
    name: 'Churrascaria Gaúcha',
    description: 'Carnes nobres no estilo rodízio',
    category: 'Churrascaria',
    address: {
      street: 'Rua Augusta, 2000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01412-100',
    },
    phone: '(11) 95678-9012',
  },
  {
    name: 'Comida Caseira da Vovó',
    description: 'Pratos caseiros feitos com carinho',
    category: 'Brasileira',
    address: {
      street: 'Rua da Consolação, 300',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01302-000',
    },
    phone: '(11) 97890-1234',
  },
];

async function getAuthToken(): Promise<string | null> {
  const email = 'carlos.restaurante@example.com';
  const password = 'password123';

  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response.data.token;
  } catch (error: any) {
    console.warn('⚠️  Could not authenticate. You may need to manually create restaurants with an authenticated user.');
    return null;
  }
}

async function seedRestaurants() {
  console.log('🌱 Seeding restaurants...');
  console.log(`API URL: ${API_URL}`);
  console.log('');

  const token = await getAuthToken();

  if (!token) {
    console.log('');
    console.log('📋 Restaurant data (manual creation required):');
    console.log(JSON.stringify(restaurants, null, 2));
    console.log('');
    console.log('💡 Instructions:');
    console.log('   1. Login as: carlos.restaurante@example.com / password123');
    console.log('   2. Use the data above to create restaurants via the API');
    console.log('   3. POST to /orders/restaurantes with Authorization header');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const restaurant of restaurants) {
    try {
      await axios.post(`${API_URL}/orders/restaurantes`, restaurant, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`✅ Created restaurant: ${restaurant.name}`);
      successCount++;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      console.error(`❌ Failed to create restaurant ${restaurant.name}: ${message}`);
      failCount++;
    }
  }

  console.log('');
  console.log(`✨ Seed completed: ${successCount} success, ${failCount} failed`);
}

// Run the seed
seedRestaurants()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
