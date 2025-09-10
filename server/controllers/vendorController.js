import Vendor from '../models/vendorSchema.js';
import logger from '../utils/logger.js';

export const createVendor = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, contactPerson, contactNumber, email, address, paymentTerms } = req.body;

    if (!name) return res.status(400).json({ error: "Vendor name is required" });

    const existing = await Vendor.findOne({ name });
    if (existing) return res.status(403).json({ error: "Vendor name must be unique!" });

    if (email) {
      const emailExists = await Vendor.findOne({ email });
      if (emailExists) return res.status(403).json({ error: "Vendor email must be unique!" });
    }

    if (contactNumber) {
      const contactExists = await Vendor.findOne({ contactNumber });
      if (contactExists) return res.status(403).json({ error: "Vendor contact number must be unique!" });
    }

    const newVendor = new Vendor({
      name,
      contactPerson,
      contactNumber,
      email,
      address,
      paymentTerms,
      transactionHistory: [],
      addedBy: userId
    });

    await newVendor.save();

    return res.status(201).json({ message: "Vendor created successfully!", vendor: newVendor });
  } catch (error) {
    logger.error('Vendor Creation Error', { error, route: 'create-vendor', body: req.body });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const vendors = await Vendor.find({})
      .skip(skip)
      .limit(limit)
      .populate('addedBy', '-password')
      .exec();

    const totalVendors = await Vendor.countDocuments();

    return res.json({
      message: "Vendors fetched successfully",
      data: vendors,
      pagination: {
        total: totalVendors,
        page,
        pages: Math.ceil(totalVendors / limit),
        limit
      }
    });
  } catch (error) {
    logger.error('Get All Vendors Error', { error, route: 'get-all-vendors', query: req.query });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId)
      .populate('addedBy', '-password')
      .populate('transactionHistory.purchaseOrderId')
      .exec();

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    return res.json({ message: "Vendor found successfully", vendor });
  } catch (error) {
    logger.error('Get Vendor By ID Error', { error, route: 'get-vendor-by-id', params: req.params });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const { name, contactPerson, contactNumber, email, address, paymentTerms } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    if (name && name !== vendor.name) {
      const nameExists = await Vendor.findOne({ name });
      if (nameExists) return res.status(403).json({ error: "Vendor name must be unique!" });
      vendor.name = name;
    }

    if (email && email !== vendor.email) {
      const emailExists = await Vendor.findOne({ email });
      if (emailExists) return res.status(403).json({ error: "Vendor email must be unique!" });
      vendor.email = email;
    }

    if (contactNumber && contactNumber !== vendor.contactNumber) {
      const contactExists = await Vendor.findOne({ contactNumber });
      if (contactExists) return res.status(403).json({ error: "Vendor contact number must be unique!" });
      vendor.contactNumber = contactNumber;
    }

    if (contactPerson !== undefined) vendor.contactPerson = contactPerson;
    if (address !== undefined) vendor.address = address;
    if (paymentTerms !== undefined) vendor.paymentTerms = paymentTerms;

    await vendor.save();

    return res.json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    logger.error('Update Vendor Error', { error, route: 'update-vendor', params: req.params, body: req.body });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    return res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    logger.error('Delete Vendor Error', { error, route: 'delete-vendor', params: req.params });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addTransactionToVendor = async (req, res) => {
  try {
    const { vendorId, purchaseOrderId, date, amount } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    vendor.transactionHistory.push({ purchaseOrderId, date, amount });
    await vendor.save();

    return res.json({ message: "Transaction added to vendor successfully", vendor });
  } catch (error) {
    logger.error('Add Transaction to Vendor Error', { error, route: 'add-transaction-to-vendor', body: req.body });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getVendorTransactionHistory = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const vendor = await Vendor.findById(vendorId)
      .select('transactionHistory')
      .populate('transactionHistory.purchaseOrderId')
      .exec();

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const totalTransactions = vendor.transactionHistory.length;
    const paginatedTransactions = vendor.transactionHistory.slice(skip, skip + limit);

    return res.json({
      message: "Transaction history fetched successfully",
      data: paginatedTransactions,
      pagination: {
        total: totalTransactions,
        page,
        pages: Math.ceil(totalTransactions / limit),
        limit
      }
    });
  } catch (error) {
    logger.error('Get Vendor Transaction History Error', { error, route: 'get-vendor-transaction-history', params: req.params, query: req.query });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeTransactionFromVendor = async (req, res) => {
  try {
    const { vendorId, transactionId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const transactionIndex = vendor.transactionHistory.findIndex(
      (transaction) => transaction._id.toString() === transactionId
    );

    if (transactionIndex === -1) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    vendor.transactionHistory.splice(transactionIndex, 1);
    await vendor.save();

    return res.json({ message: "Transaction removed successfully", vendor });
  } catch (error) {
    logger.error('Remove Transaction From Vendor Error', { error, route: 'remove-transaction-from-vendor', params: req.params });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTransactionInVendor = async (req, res) => {
  try {
    const { vendorId, transactionId } = req.params;
    const { purchaseOrderId, date, amount } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const transaction = vendor.transactionHistory.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (purchaseOrderId) transaction.purchaseOrderId = purchaseOrderId;
    if (date) transaction.date = date;
    if (amount !== undefined) transaction.amount = amount;

    await vendor.save();

    return res.json({ message: "Transaction updated successfully", vendor });
  } catch (error) {
    logger.error('Update Transaction In Vendor Error', { error, route: 'update-transaction-in-vendor', params: req.params, body: req.body });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};









