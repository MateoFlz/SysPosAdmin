export interface PaginationMeta {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PagedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
}
