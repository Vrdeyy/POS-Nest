import { IsNotEmpty, IsString, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;
}
