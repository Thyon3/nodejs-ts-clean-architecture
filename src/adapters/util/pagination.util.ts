export default class PaginationUtil {
  static limit = 10;

  static getPagination(page: number): number {
    if (page !== null) {
      return page <= 0 ? 0 : (page - 1) * this.limit;
    }
    return 0;
  }
}
