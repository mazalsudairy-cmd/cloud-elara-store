/** Product billing: `month` shows /شهر or /mo next to price. */
export const PRICE_PERIOD_ONE_TIME = 'one_time';
export const PRICE_PERIOD_MONTH = 'month';

export function isMonthlyProduct(product) {
  return product?.price_period === PRICE_PERIOD_MONTH;
}
