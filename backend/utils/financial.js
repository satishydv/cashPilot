/**
 * Financial Calculation Utilities
 * Enforces server-side calculations for all monetary figures and commissions
 */

export const roundCurrency = (value) => {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
};

export const calculateFinancials = (amount, commissionRate) => {
  const parsedAmount = roundCurrency(amount);
  const parsedRate = Number(commissionRate);

  if (isNaN(parsedAmount) || parsedAmount < 0) {
    throw new Error("Invalid transaction amount");
  }

  if (isNaN(parsedRate) || parsedRate < 0 || parsedRate > 100) {
    throw new Error("Invalid commission rate. Must be between 0 and 100");
  }

  const commissionAmount = roundCurrency((parsedAmount * parsedRate) / 100);
  const netPayoutAmount = roundCurrency(parsedAmount - commissionAmount);

  return {
    amount: parsedAmount,
    commissionRate: parsedRate,
    commissionAmount,
    netPayoutAmount,
  };
};
