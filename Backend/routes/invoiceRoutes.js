const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

//invoice details

router.get("/getAll-invoices", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  try {
    const result = await getAllInvoices();
    res.status(200).json(result);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})



router.post("/Create-invoices", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {
 

  const  {customerName,customerAddress,
    date,
    validity,
    items,
    note,
    terms,
    total} = req.body;
  const uid = req.uid;
  
  const invoiceData ={customerName,
    customerAddress,
    date,
    validity,
    items,
    note,
    terms,
    total,uid}
  console.log('invoice ',customerName);
  try {
    const result = await createInvoice(invoiceData,uid);
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
})
router.put("/update-invoices:id", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  try {
    const result = await updateInvoice(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})





router.post("/Create-invoice-pdf",authMiddleware,roleMiddleware("super_admin"),async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req.body); 
    const base64PDF = pdfBuffer.toString("base64");
    res.status(200).json({ pdf: base64PDF, fileName: `invoice_${Date.now()}.pdf` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
);




module.exports = router;
