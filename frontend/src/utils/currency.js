/**
 * Formats a number to Indian currency format (e.g., ₹1,25,000)
 * @param {number|string} amount
 * @returns {string}
 */
export const formatIndianCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // Format using Indian locale
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absNum);

  return `${isNegative ? '-' : ''}₹${formatted}`;
};
