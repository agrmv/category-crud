import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique category name',
    example: 'Books',
  })
  readonly slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category name',
    example: 'Scientific literature',
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category description',
    example: 'Popular science books',
  })
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Category state',
    enum: [true, false, 1, 0],
  })
  @Transform(({ value }) =>
    [0, 1, true, false, '0', '1', 'true', 'false'].includes(value)
      ? !!JSON.parse(value)
      : '',
  )
  readonly active: boolean;
}