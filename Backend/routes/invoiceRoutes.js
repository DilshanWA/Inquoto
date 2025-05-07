const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.post("/", authMiddleware, createInvoice);


router.get("/", authMiddleware, getInvoices); 


router.get("/:id", authMiddleware, getInvoiceById);


router.put("/:id", authMiddleware, updateInvoice);


router.delete("/:id", authMiddleware, deleteInvoice);

module.exports = router;
