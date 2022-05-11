import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PatchCategoryDto } from './dto/patch-category.dto';
import { Category } from './category.schema';
import { FindOneParams } from './utils/find-one-params';
import { IdParam } from './utils/id-param';
import { QueryParams } from './utils/query-params';
import { ApiResponse } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get(':identifier')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success response.',
    type: Category,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found.',
  })
  findOne(@Param() { identifier }: FindOneParams): Promise<Category> {
    return this.categoryService.findOne(identifier);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success response.',
    type: Category,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request.',
  })
  getAll(@Query() params: QueryParams): Promise<Category[]> {
    return this.categoryService.getAll(params);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success response.',
    type: Category,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request.',
  })
  create(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(data);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success response.',
    type: Category,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found.',
  })
  patch(
    @Param() { id }: IdParam,
    @Body() data: PatchCategoryDto,
  ): Promise<Category> {
    return this.categoryService.patch(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Success response.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found.',
  })
  delete(@Param() { id }: IdParam): Promise<void> {
    return this.categoryService.delete(id);
  }
}
