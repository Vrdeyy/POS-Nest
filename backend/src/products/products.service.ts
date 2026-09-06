import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  
  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({data: createProductDto});
    return { message: 'Produk berhasil ditambahkan', data: product };
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    
    if (products.length === 0) {
      return { message: 'Belum ada produk yang ditambahkan', data: [] };
    }
    
    return { message: 'Berhasil mengambil data produk', data: products };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({where: {id}});
    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const updatedProduct = await this.prisma.product.update({where: {id}, data: updateProductDto});
      return { message: `Produk dengan ID ${id} berhasil diupdate`, data: updatedProduct };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({where: {id}});
      return { message: `Produk dengan ID ${id} berhasil dihapus` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
      }
      throw error;
    }
  }
}
