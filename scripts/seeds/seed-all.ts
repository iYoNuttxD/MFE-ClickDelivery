/**
 * Seed All
 * Runs all seed scripts in sequence
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

const seedScripts = [
  'seed-users.ts',
  'seed-restaurants.ts',
  'seed-delivery.ts',
];

async function runSeed(script: string): Promise<void> {
  const scriptPath = path.join(__dirname, script);
  console.log('');
  console.log('═'.repeat(80));
  console.log(`Running: ${script}`);
  console.log('═'.repeat(80));
  console.log('');

  try {
    const { stdout, stderr } = await execAsync(`npx ts-node "${scriptPath}"`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error: any) {
    console.error(`Error running ${script}:`, error.message);
    // Continue with other seeds even if one fails
  }
}

async function seedAll() {
  console.log('🚀 Starting comprehensive seed process...');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: ${process.env.SEED_API_URL || process.env.VITE_API_URL || 'https://cd-apim-gateway.azure-api.net/api/v1'}`);
  console.log('');
  console.log('⏰ This may take a few minutes...');

  for (const script of seedScripts) {
    await runSeed(script);
  }

  console.log('');
  console.log('═'.repeat(80));
  console.log('✨ All seed scripts completed!');
  console.log('═'.repeat(80));
  console.log('');
  console.log('📋 Summary:');
  console.log('   - Users created (customers, restaurant, courier, owner, admin)');
  console.log('   - Restaurants created (if authentication succeeded)');
  console.log('   - Vehicles created (if authentication succeeded)');
  console.log('');
  console.log('🎉 Your development environment is ready!');
  console.log('');
  console.log('🔑 Test credentials:');
  console.log('   Customer:   joao.silva@example.com / password123');
  console.log('   Restaurant: carlos.restaurante@example.com / password123');
  console.log('   Courier:    pedro.entregador@example.com / password123');
  console.log('   Owner:      ana.proprietaria@example.com / password123');
  console.log('   Admin:      admin@clickdelivery.com / admin123');
  console.log('');
}

// Run all seeds
seedAll()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error in seed-all:', error);
    process.exit(1);
  });
