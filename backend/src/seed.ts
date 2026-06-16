import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // load .env

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
});

const products = [
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with long battery life', price: 29.99, stock: 50 },
  { name: 'Mechanical Keyboard', description: 'Tactile switches, RGB backlight', price: 89.99, stock: 30 },
  { name: 'USB-C Hub', description: '7-in-1 hub with HDMI, USB 3.0, and SD card slots', price: 45.00, stock: 25 },
  { name: 'Webcam 1080p', description: 'Full HD webcam with built-in mic', price: 59.99, stock: 20 },
  { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', price: 34.99, stock: 40 },
  { name: 'Monitor Stand', description: 'Adjustable aluminum monitor riser', price: 49.99, stock: 15 },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  const repo = AppDataSource.getRepository('products');

  // Clear existing products before seeding so we don't duplicate
  await repo.clear();

  for (const product of products) {
    await repo.save(repo.create(product));
  }

  console.log(`Seeded ${products.length} products`);
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
