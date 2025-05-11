
const express = require("express");
const router = express.Router();


const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



//quotations details

router.get("/getAll-quotations", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

    try {
      const result = await getAllQuotations();
      res.status(200).json(result);
  
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  })


router.post("/Create-quotations", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

    const {name ,price ,status } = req.body;
    const uid = req.uid;
    const quotationdetails= {name ,price ,status, uid} 
    try {
      const result = await createQuotation(quotationdetails);
      res.status(200).json(result);
  
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  })
  
  
  
  router.delete("/delete-quotations:id", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {
  
  
    try {
      const result = await deleteQuotation(req.params.id);
      res.status(200).json(result);
  
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  
  
  })
  
  
  
  router.put("/update-quotations:id", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {
  
  
    try {
      const result = await updateInvoice(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
  
  })
  
  
  