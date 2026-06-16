import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Product } from './products/product.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { User } from './users/user.entity';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    // Load .env file globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to PostgreSQL using values from .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') ?? '5432', 10),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Product, Order, OrderItem, User],
        synchronize: true, // auto-creates tables in dev — turn off in production
      }),
    }),

    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
  providers: [
    // Apply JwtAuthGuard globally — routes opt out using @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
