/**
 * Base Payout Provider Interface
 */
export class PayoutProvider {
  /**
   * Initiate a vendor payout
   * @param {Object} payoutData
   * @returns {Promise<Object>}
   */
  async initiatePayout(payoutData) {
    throw new Error("initiatePayout method not implemented");
  }

  /**
   * Check status of a payout
   * @param {String} payoutId
   * @returns {Promise<Object>}
   */
  async getPayoutStatus(payoutId) {
    throw new Error("getPayoutStatus method not implemented");
  }
}

export default PayoutProvider;
