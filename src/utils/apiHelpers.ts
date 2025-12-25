import { PaginationMetadata } from '../types';

export class PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMetadata;

  constructor(success: boolean, message: string, data: T[], pagination: PaginationMetadata) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }
}

export class PaginationHelper {
  static calculatePagination(
    totalItems: number,
    page: number = 1,
    limit: number = 10
  ): PaginationMetadata {
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.min(Math.max(1, page), totalPages);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }

  static getSkipValue(page: number = 1, limit: number = 10): number {
    return (Math.max(1, page) - 1) * limit;
  }
}
