const express = require("express");
const router = express.Router();

const { Login, getProfile } = require("../controllers/userController");

const {Createinvoice} = require("../utils/adminFun");


//login
router.post("/login", Login);


router.get("/admin-dashboard", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({ message: "Super Admin Area " });
});



//Create invoice
router.post("/Create-invoices", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    const {name , price} = req.body;
    const uid = req.uid;
    const Createinvoice = {name , price , uid};
    try {
        const result = await Createinvoice(Createinvoice);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// UPDATE INVOICE
router.put("/Update-invoices", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
      const { oldInvoiceId, updatedData, uid } = req.body;
  
      const result = await updateInvoice(oldInvoiceId, updatedData, uid);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // DELETE INVOICE
  router.delete("/Delete-invoices", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
      const { invoiceId, uid } = req.body;
  
      const result = await DeleteInvoice(invoiceId, uid);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });









// CREATE QUOTATION
router.post("/Create-quotations", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
      const result = await CreateQuotation(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // UPDATE QUOTATION
  router.put("/Update-quotations", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
      const { oldQuotationId, updatedData, uid } = req.body;
      const result = await UpdateQuotation(oldQuotationId, updatedData, uid);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // DELETE QUOTATION
  router.delete("/Delete-quotations", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
      const { quotationId, uid } = req.body;
      const result = await DeleteQuotation(quotationId, uid);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

module.exports = router;