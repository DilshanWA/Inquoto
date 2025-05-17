const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const userController = require("../routes/route/userRoute");
const quotationController = require("../routes/route/quotationsRoute");
const invoiceController = require("../routes/route/invoiceRoutes");



//  Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Optional: protected profile route
router.get("/profile", authMiddleware, userController.getProfile);

//  Get super admin dashboard info
router.get("/admin-details",authMiddleware,userController.getAdminDashboard);

//  Add a new admin user
router.post( "/add-user",authMiddleware,roleMiddleware("super_admin"),userController.addAdmin);
//  Delete an admin user
router.delete("/delete-user/:id",authMiddleware,roleMiddleware("super_admin"),userController.removeAdmin);



//  GET all quotations
router.get("/getAll-quotations",authMiddleware,quotationController.getAll);
//  Create a quotation
router.post("/create-quotations",authMiddleware,quotationController.create);
//  Delete a quotation
router.delete("/delete-quotations",authMiddleware,quotationController.remove);
//  Update a quotation
router.put("/update-quotations",authMiddleware,quotationController.update);
//update state
router.put("/quotations-state",authMiddleware,userController.State);


//  GET all invoices
router.get("/getAll-invoices",authMiddleware,invoiceController.getAll);
//  Create an invoice
router.post("/create-invoices",authMiddleware,invoiceController.create);
//  Delete an invoice
router.delete("/delete-invoices",authMiddleware,invoiceController.remove);
//  Update an invoice
router.put("/update-invoices",authMiddleware,invoiceController.update);
//update state
router.put("/invoices-state",authMiddleware,userController.State);


//  Generate invoice PDF
router.post("/create-pdf",invoiceController.genPDF);





module.exports = router;
