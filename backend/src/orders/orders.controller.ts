import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get orders (admin: all, customer: own)' })
  findAll(@Request() req: any) {
    return this.ordersService.findAll(req.user?.id, req.user?.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Submit cart and create an order' })
  create(@Body() dto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.createOrder(dto, req.user?.id);
  }
}
