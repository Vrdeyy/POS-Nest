import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTransactionDto) {
    if (!userId) {
      throw new BadRequestException(
        'User ID tidak ditemukan dari token authentication',
      );
    }

    // Fix: tambahkan tipe (tx: Prisma.TransactionClient)
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let grandTotal = 0;
      const detailData = [];

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Produk dengan ID ${item.productId} tidak ditemukan`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stok untuk produk ${product.name} tidak cukup. Sisa stok: ${product.stock}`,
          );
        }

        const subtotal = product.price * item.quantity;
        grandTotal += subtotal;

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });

        detailData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          subtotal: subtotal,
        });
      }

      const transaction = await tx.transaction.create({
        data: {
          userId: userId,
          total: grandTotal,
          details: {
            createMany: {
              data: detailData,
            },
          },
        },
        include: {
          details: true,
        },
      });

      return transaction;
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        user: {
          select: { id: true, name: true, username: true, role: true },
        },
        details: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
