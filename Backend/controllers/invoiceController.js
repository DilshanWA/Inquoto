const { db } = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

//  Create
const createInvoice = async (req, res) => {
  try {
    const id = uuidv4();
    const invoiceData = {
      id,
      ...req.body,
      createdBy: req.user.uid,
      createdAt: new Date(),
    };
    await db.collection("invoices").doc(id).set(invoiceData);
    res.status(201).json({ message: "Invoice created", invoice: invoiceData });
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error: error.message });
  }
};

//  Read All
const getInvoices = async (req, res) => {
  try {
    const snapshot = await db.collection("invoices").get();
    const invoices = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (req.user.role === "superadmin" || data.createdBy === req.user.uid) {
        invoices.push(data);
      }
    });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error getting invoices", error: error.message });
  }
};

//  Read by ID
const getInvoiceById = async (req, res) => {
  try {
    const doc = await db.collection("invoices").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "Invoice not found" });

    const invoice = doc.data();
    if (req.user.role !== "superadmin" && invoice.createdBy !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error: error.message });
  }
};

//  Update
const updateInvoice = async (req, res) => {
  try {
    const ref = db.collection("invoices").doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) return res.status(404).json({ message: "Invoice not found" });

    const data = doc.data();
    if (req.user.role !== "superadmin" && data.createdBy !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Save old record
    await db.collection("invoices_history").add({
      ...data,
      updatedAt: new Date(),
      updatedBy: req.user.uid,
    });

    // Update invoice
    await ref.update({ ...req.body, updatedAt: new Date(), updatedBy: req.user.uid });
    res.status(200).json({ message: "Invoice updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error: error.message });
  }
};

//  Delete
const deleteInvoice = async (req, res) => {
  try {
    const ref = db.collection("invoices").doc(req.params.id);
    const doc = await ref.get();

    if (!doc.exists) return res.status(404).json({ message: "Invoice not found" });

    const data = doc.data();
    if (req.user.role !== "superadmin" && data.createdBy !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await ref.delete();
    res.status(200).json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice", error: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
