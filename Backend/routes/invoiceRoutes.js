const express = require("express");
const { createInvoice, getInvoices } = require("../controllers/invoiceController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createInvoice);
router.get("/", authMiddleware, getInvoices);

module.exports = router;
