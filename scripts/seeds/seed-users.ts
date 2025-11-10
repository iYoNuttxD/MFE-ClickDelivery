/**
 * Seed Users
 * Creates sample users for development environment
 */

import axios from 'axios';

const API_URL = process.env.SEED_API_URL || process.env.VITE_API_BASE_URL || 'https://cd-apim-gateway.azure-api.net/api/v1';

interface UserSeed {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const users: UserSeed[] = [
  // Customers
  {
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@example.com',
    password: 'password123',
    role: 'customer',
  },
  {
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@example.com',
    password: 'password123',
    role: 'customer',
  },
  // Restaurant
  {
    firstName: 'Carlos',
    lastName: 'Oliveira',
    email: 'carlos.restaurante@example.com',
    password: 'password123',
    role: 'restaurant',
  },
  // Courier
  {
    firstName: 'Pedro',
    lastName: 'Costa',
    email: 'pedro.entregador@example.com',
    password: 'password123',
    role: 'courier',
  },
  // Owner
  {
    firstName: 'Ana',
    lastName: 'Rodrigues',
    email: 'ana.proprietaria@example.com',
    password: 'password123',
    role: 'owner',
  },
  // Admin
  {
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@clickdelivery.com',
    password: 'admin123',
    role: 'admin',
  },
];

async function seedUsers() {
  console.log('🌱 Seeding users...');
  console.log(`API URL: ${API_URL}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const user of users) {
    try {
      await axios.post(`${API_URL}/users/register`, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(`✅ Created user: ${user.email} (${user.role})`);
      successCount++;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      console.error(`❌ Failed to create user ${user.email}: ${message}`);
      failCount++;
    }
  }

  console.log('');
  console.log(`✨ Seed completed: ${successCount} success, ${failCount} failed`);
  
  if (failCount > 0) {
    console.log('');
    console.log('💡 Tip: If users already exist, this is normal. You can ignore these errors.');
  }

  console.log('');
  console.log('📋 User credentials for testing:');
  users.forEach(user => {
    console.log(`   ${user.role.padEnd(10)} - ${user.email} / password123`);
  });
}

// Run the seed
seedUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
