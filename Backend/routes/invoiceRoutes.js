const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



const {createInvoice , getAllInvoices} = require('../utils/superAdminFun')
const  {generatePDF} = require('../utils/pdfGenerator');
//invoice details

router.get("/getAll-invoices", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  try {
    const result = await getAllInvoices();
    res.status(200).json(result);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})



router.post("/Create-invoices", authMiddleware, async (req, res) => {
 
  console.log("Invoice received:", req.body);


  try {
    const result = await createInvoice(req.body);
    res.status(200).json(result);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }


})



router.delete("/delete-invoices:id", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  try {
    const result = await deleteInvoice(req.params.id);
    res.status(200).json(result);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.put("/update-invoices:id", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  try {
    const result = await updateInvoice(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})





router.post( "/Create-invoice-pdf",authMiddleware, async (req, res) => {
    try {
      const pdfBuffer = await generatePDF(req.body);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=invoice_${Date.now()}.pdf`);
      res.send(pdfBuffer); // no base64 encoding here
    } catch (error) {
      console.error("PDF Generation Error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);





module.exports = router;
