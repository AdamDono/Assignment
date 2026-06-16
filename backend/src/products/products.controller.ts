import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product (admin only)' })
  create(@Body() dto: CreateProductDto, @Request() req: any) {
    if (req.user?.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (admin only)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateProductDto>,
    @Request() req: any,
  ) {
    if (req.user?.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    if (req.user?.role !== 'admin') throw new ForbiddenException('Admins only');
    return this.productsService.remove(id);
  }
}
