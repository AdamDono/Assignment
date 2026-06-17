import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

config(); // load .env

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, User, Order, OrderItem],
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

  // Clear existing data before seeding to avoid duplicate key or FK constraint issues
  await AppDataSource.query('TRUNCATE TABLE "order_items" CASCADE;');
  await AppDataSource.query('TRUNCATE TABLE "orders" CASCADE;');
  await AppDataSource.query('TRUNCATE TABLE "products" CASCADE;');
  await AppDataSource.query('TRUNCATE TABLE "users" CASCADE;');

  // Seed Products
  const productRepo = AppDataSource.getRepository(Product);
  for (const product of products) {
    await productRepo.save(productRepo.create(product));
  }
  console.log(`Seeded ${products.length} products`);

  // Seed Users (Admin & Customer)
  const userRepo = AppDataSource.getRepository(User);
  
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = userRepo.create({
    email: 'admin@shop.com',
    password: adminPasswordHash,
    role: 'admin',
  });
  await userRepo.save(adminUser);
  console.log('Seeded admin user: admin@shop.com / admin123');

  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  const customerUser = userRepo.create({
    email: 'customer@shop.com',
    password: customerPasswordHash,
    role: 'customer',
  });
  await userRepo.save(customerUser);
  console.log('Seeded customer user: customer@shop.com / customer123');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
