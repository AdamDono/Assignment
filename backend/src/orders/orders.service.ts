import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepo: Repository<OrderItem>,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  /** Admin: all orders. Customer: only their own orders. */
  findAll(userId?: number, role?: string): Promise<Order[]> {
    if (role === 'admin') {
      return this.ordersRepo.find({ order: { createdAt: 'DESC' } });
    }
    return this.ordersRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepo.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  // We use a transaction here so that if anything fails (e.g. stock runs out
  // mid-checkout) the whole order is rolled back cleanly.
  async createOrder(dto: CreateOrderDto, userId: number): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      let total = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of dto.items) {
        const product = await this.productsService.findOne(cartItem.productId);

        if (product.stock < cartItem.quantity) {
          throw new BadRequestException(
            `Not enough stock for "${product.name}". Available: ${product.stock}`,
          );
        }

        // Reduce stock
        product.stock -= cartItem.quantity;
        await manager.save(product);

        const item = manager.create(OrderItem, {
          product,
          quantity: cartItem.quantity,
          unitPrice: product.price,
        });

        total += Number(product.price) * cartItem.quantity;
        orderItems.push(item);
      }

      const order = manager.create(Order, {
        total: parseFloat(total.toFixed(2)),
        items: orderItems,
        userId,
      });

      return manager.save(order);
    });
  }
}
