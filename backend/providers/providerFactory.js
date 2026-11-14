import MockPaymentProvider from "./payment/MockPaymentProvider.js";
import CashfreePaymentProvider from "./payment/CashfreePaymentProvider.js";
import MockPayoutProvider from "./payout/MockPayoutProvider.js";
import CashfreePayoutProvider from "./payout/CashfreePayoutProvider.js";

class ProviderFactory {
  constructor() {
    this.paymentProviders = {
      mock: new MockPaymentProvider(),
      cashfree: new CashfreePaymentProvider(),
    };

    this.payoutProviders = {
      mock: new MockPayoutProvider(),
      cashfree: new CashfreePayoutProvider(),
    };
  }

  getPaymentProvider(name) {
    const providerName = (name || process.env.PAYMENT_PROVIDER || "mock").toLowerCase();
    const provider = this.paymentProviders[providerName];
    if (!provider) {
      throw new Error(`Payment provider "${providerName}" is not supported`);
    }
    return provider;
  }

  getPayoutProvider(name) {
    const providerName = (name || process.env.PAYOUT_PROVIDER || "mock").toLowerCase();
    const provider = this.payoutProviders[providerName];
    if (!provider) {
      throw new Error(`Payout provider "${providerName}" is not supported`);
    }
    return provider;
  }
}

export const providerFactory = new ProviderFactory();
export default providerFactory;
