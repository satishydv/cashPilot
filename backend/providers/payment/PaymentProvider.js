/**
 * Base Payment Provider Interface
 */
export class PaymentProvider {
  /**
   * Create a payment order / session
   * @param {Object} orderData
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    throw new Error("createOrder method not implemented");
  }

  /**
   * Verify webhook signature or payment status
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async verifyPayment(data) {
    throw new Error("verifyPayment method not implemented");
  }
}

export default PaymentProvider;
