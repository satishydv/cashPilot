import {
  createTransaction,
  getTransactionById,
  getTransactionByReference,
} from "../services/transaction.service.js";

/**
 * @desc    Initiate a new transaction and generate gateway payment session
 * @route   POST /api/transactions
 * @access  Public (Called during checkout)
 */
export const initiateTransaction = async (req, res) => {
  try {
    const { vendorId, customerName, customerPhone, customerEmail, amount, returnUrl } = req.body;

    if (!vendorId || !customerName || !customerPhone || !customerEmail || !amount) {
      return res.status(400).json({
        success: false,
        message: "vendorId, customerName, customerPhone, customerEmail, and amount are required",
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const result = await createTransaction({
      vendorId,
      customerName,
      customerPhone,
      customerEmail,
      amount: Number(amount),
      returnUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Transaction initiated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate transaction",
    });
  }
};

/**
 * @desc    Get transaction by ID or reference
 * @route   GET /api/transactions/:identifier
 * @access  Public / Private
 */
export const getTransactionDetails = async (req, res) => {
  try {
    const { identifier } = req.params;

    let transaction;
    if (identifier.startsWith("TXN_")) {
      transaction = await getTransactionByReference(identifier);
    } else {
      transaction = await getTransactionById(identifier);
    }

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
      error: error.message,
    });
  }
};
