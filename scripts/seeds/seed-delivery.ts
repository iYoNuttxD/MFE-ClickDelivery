/**
 * Seed Delivery
 * Creates sample vehicles and delivery data for development environment
 */

import axios from 'axios';

const API_URL = process.env.SEED_API_URL || process.env.VITE_API_BASE_URL || 'https://cd-apim-gateway.azure-api.net/api/v1';

interface VehicleSeed {
  type: string;
  plate: string;
  model: string;
  year: number;
  dailyRate: number;
}

const vehicles: VehicleSeed[] = [
  {
    type: 'Moto',
    plate: 'ABC-1234',
    model: 'Honda CG 160',
    year: 2022,
    dailyRate: 80,
  },
  {
    type: 'Moto',
    plate: 'DEF-5678',
    model: 'Yamaha Fazer 250',
    year: 2023,
    dailyRate: 100,
  },
  {
    type: 'Carro',
    plate: 'GHI-9012',
    model: 'Fiat Uno',
    year: 2021,
    dailyRate: 120,
  },
  {
    type: 'Bicicleta',
    plate: 'BIKE-001',
    model: 'Caloi Explorer',
    year: 2023,
    dailyRate: 30,
  },
];

async function getOwnerToken(): Promise<string | null> {
  const email = 'ana.proprietaria@example.com';
  const password = 'password123';

  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response.data.token;
  } catch (error: any) {
    console.warn('⚠️  Could not authenticate as owner.');
    return null;
  }
}

async function getCourierToken(): Promise<string | null> {
  const email = 'pedro.entregador@example.com';
  const password = 'password123';

  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response.data.token;
  } catch (error: any) {
    console.warn('⚠️  Could not authenticate as courier.');
    return null;
  }
}

async function seedVehicles() {
  console.log('🌱 Seeding vehicles...');
  console.log(`API URL: ${API_URL}`);
  console.log('');

  const token = await getOwnerToken();

  if (!token) {
    console.log('');
    console.log('📋 Vehicle data (manual creation required):');
    console.log(JSON.stringify(vehicles, null, 2));
    console.log('');
    console.log('💡 Instructions:');
    console.log('   1. Login as: ana.proprietaria@example.com / password123');
    console.log('   2. Use the data above to create vehicles via the API');
    console.log('   3. POST to /deliveries/veiculos with Authorization header');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const vehicle of vehicles) {
    try {
      await axios.post(`${API_URL}/deliveries/veiculos`, vehicle, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`✅ Created vehicle: ${vehicle.model} (${vehicle.plate})`);
      successCount++;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      console.error(`❌ Failed to create vehicle ${vehicle.plate}: ${message}`);
      failCount++;
    }
  }

  console.log('');
  console.log(`✨ Seed completed: ${successCount} success, ${failCount} failed`);
  
  if (failCount > 0) {
    console.log('');
    console.log('💡 Tip: If vehicles already exist, this is normal. You can ignore these errors.');
  }
}

async function seedDeliveries() {
  console.log('');
  console.log('🌱 Seeding sample deliveries...');
  
  const courierToken = await getCourierToken();

  if (!courierToken) {
    console.log('⚠️  Could not create sample deliveries without courier authentication');
    return;
  }

  console.log('💡 Note: Deliveries are typically created automatically when orders are placed.');
  console.log('   This seed focuses on vehicles. Create orders via the customer interface to generate deliveries.');
}

// Run the seed
async function main() {
  await seedVehicles();
  await seedDeliveries();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
