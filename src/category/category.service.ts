import { FilterQuery, Model } from 'mongoose';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PatchCategoryDto } from './dto/patch-category.dto';

@Injectable()
export class CategoryService {
  private static readonly defaultPageSize = 2;

  private static readonly defaultSort = '-createdDate';

  private static isFirstPage(page: number): boolean {
    return !page || page === 1;
  }

  private static getFilterProperties(params: {
    id?: string;
    slug?: string;
    name?: string;
    description?: string;
    search?: string;
    active?: boolean;
    pageSize?: number;
    page?: number;
    sort?: string;
  }): FilterQuery<CategoryDocument> {
    const filter = [];
    if (params.id?.trim().length > 0) {
      filter.push({ _id: params.id });
    }

    if (params.slug?.trim().length > 0) {
      filter.push({ slug: params.slug });
    }

    if (!params.search && params.name?.trim().length > 0) {
      filter.push({ name: { $regex: new RegExp(params.name, 'i') } });
    }

    if (!params.search && params.description?.trim().length > 0) {
      filter.push({
        description: { $regex: new RegExp(params.description, 'i') },
      });
    }

    if (params.search?.trim().length > 0) {
      filter.push({
        $or: [
          { name: { $regex: new RegExp(params.search, 'i') } },
          {
            description: { $regex: new RegExp(params.search, 'i') },
          },
        ],
      });
    }

    if (params.hasOwnProperty('active')) {
      filter.push({ active: params.active });
    }

    return Object.assign({}, ...filter);
  }

  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(categoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    if (await this.categoryModel.exists({ slug: categoryDto.slug })) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Category with this slug already exist.',
      });
    }
    return new this.categoryModel(categoryDto).save();
  }

  async findOneById(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ _id: id }).exec();
    if (!category) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Category with specified id not found.',
      });
    }
    return category;
  }

  async getAll(params: {
    id?: string;
    slug?: string;
    name?: string;
    description?: string;
    active?: boolean;
    pageSize?: number;
    page?: number;
    sort?: string;
  }): Promise<CategoryDocument[]> {
    return this.categoryModel
      .find(CategoryService.getFilterProperties(params))
      .limit(params.pageSize || CategoryService.defaultPageSize)
      .skip(CategoryService.isFirstPage(params.page) ? 0 : params.page)
      .sort(params.sort || CategoryService.defaultSort)
      .exec();
  }

  async patch(
    id: string,
    categoryDto: PatchCategoryDto,
  ): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ _id: id }).exec();
    if (!category) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Category with specified id not found.',
      });
    }
    return this.categoryModel
      .findOneAndUpdate({ _id: id }, categoryDto, { returnOriginal: false })
      .exec();
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryModel.findOne({ _id: id }).exec();
    if (!category) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Category with specified id not found.',
      });
    }
    await this.categoryModel.deleteOne({ _id: id }).exec();
  }
}
