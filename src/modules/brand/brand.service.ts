import Brand from './brand.model';
import { ConflictError, NotFoundError } from '../../middlewares/errorHandler';
import { IBrand, BrandFilterParams, CreateBrandPayload, PaginatedBrands } from '../../types';
import { PaginationHelper } from '../../utils/apiHelpers';

class BrandService {
  async create(payload: CreateBrandPayload): Promise<IBrand> {
    const existing = await Brand.findOne({
      name: payload.name,
      sellerId: payload.sellerId,
    });

    if (existing) {
      throw new ConflictError('Brand with this name already exists for your account');
    }

    const brand = await Brand.create(payload);
    return brand;
  }

  async list(query: BrandFilterParams): Promise<PaginatedBrands> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      sellerId,
    } = query;

    const filter: any = {};

    if (sellerId) {
      filter.sellerId = sellerId;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = PaginationHelper.getSkipValue(page, limit);

    const [brands, totalItems] = await Promise.all([
      Brand.find(filter).populate('sellerId', 'name email').sort(sort).skip(skip).limit(limit),
      Brand.countDocuments(filter),
    ]);

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return {
      brands,
      pagination,
    };
  }

  async findById(id: string): Promise<IBrand> {
    const brand = await Brand.findById(id).populate('sellerId', 'name email');
    if (!brand) {
      throw new NotFoundError('Brand not found');
    }
    return brand;
  }
}

export default new BrandService();
