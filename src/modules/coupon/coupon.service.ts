import Coupon from './coupon.model';
import { ConflictError, NotFoundError } from '../../middlewares/errorHandler';
import { ICoupon, CouponFilterParams, CreateCouponPayload, PaginatedCoupons } from '../../types';
import { PaginationHelper } from '../../utils/apiHelpers';

class CouponService {
  async create(payload: CreateCouponPayload): Promise<ICoupon> {
    const existing = await Coupon.findOne({
      code: payload.code.toUpperCase(),
      sellerId: payload.sellerId,
    });

    if (existing) throw new ConflictError('Coupon code already exists');

    const coupon = await Coupon.create(payload);
    return coupon;
  }

  async list(query: CouponFilterParams): Promise<PaginatedCoupons> {
    const {
      page = 1,
      limit = 10,
      search,
      discountType,
      isActive,
      validOnly,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      sellerId,
    } = query;

    const filter: any = {};

    if (sellerId) filter.sellerId = sellerId;
    if (discountType) filter.discountType = discountType;
    if (isActive !== undefined) filter.isActive = isActive;

    if (validOnly) {
      const now = new Date();
      filter.validFrom = { $lte: now };
      filter.validUntil = { $gte: now };
    }

    if (search) {
      filter.code = { $regex: search, $options: 'i' };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = PaginationHelper.getSkipValue(page, limit);

    const [coupons, totalItems] = await Promise.all([
      Coupon.find(filter).populate('sellerId', 'name email').sort(sort).skip(skip).limit(limit),
      Coupon.countDocuments(filter),
    ]);

    const pagination = PaginationHelper.calculatePagination(totalItems, page, limit);

    return { coupons, pagination };
  }

  async findById(id: string): Promise<ICoupon> {
    const coupon = await Coupon.findById(id).populate('sellerId', 'name email');
    if (!coupon) throw new NotFoundError('Coupon not found');
    return coupon;
  }
}

export default new CouponService();
