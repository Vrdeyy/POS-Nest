import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Role } from '@prisma/client';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles('KASIR')
  async create(@Req() req: any, @Body() dto: CreateTransactionDto) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    return this.transactionsService.create(userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.KASIR)
  async findAll() {
    return this.transactionsService.findAll();
  }
}
