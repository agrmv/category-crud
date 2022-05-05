import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneParams {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    required: true,
    description: 'Id of category',
  })
  readonly id: string;
}
