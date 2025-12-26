import Product from './product.model';
import Brand from '../brand/brand.model';
import { NotFoundError } from '../../middlewares/errorHandler';
import { IProduct, ProductFilterParams, CreateProductPayload, PaginatedProducts } from '../../types';
import { PaginationHelper } from '../../utils/apiHelpers';

class ProductService {
  async create(payload: CreateProductPayload): Promise<IProduct> {
    const brand = await Brand.findOne({ _id: payload.brandId, sellerId: payload.sellerId });
    if (!brand) throw new NotFoundError('Brand not found or does not belong to you');

    const product = await Product.create(payload);
    return product;
  }

  async list(query: ProductFilterParams): Promise<PaginatedProducts> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      brandId,
      minPrice,
      maxPrice,
      inStock,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      sellerId,
    } = query;

    const filter: any = {};

    if (sellerId) filter.sellerId = sellerId;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (brandId) filter.brandId = brandId;
    if (isActive !== undefined) filter.isActive = isActive;
    if (inStock) filter.stock = { $gt: 0 };

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = PaginationHelper.getSkipValue(page, limit);

    const [products, totalItems] = await Promise.all([
      Product.find(filter)
        .populate('sellerId', 'name email')
        .populate('brandId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return { products, pagination };
  }

  async findById(id: string): Promise<IProduct> {
    const product = await Product.findById(id)
      .populate('sellerId', 'name email')
      .populate('brandId', 'name');
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }
}

export default new ProductService();
