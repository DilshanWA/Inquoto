const express = require("express");
const router = express.Router();

const { Login, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { addAdminUser, RemoveAdmin } = require("../utils/superAdminFun");

//login
router.post("/login", Login);



//  Protected Route - Any authenticated user
// router.get("/profile", authMiddleware,roleMiddleware("super_admin"), getProfile);

router.get("/super-dashboard", authMiddleware, roleMiddleware("super_admin"), (req, res) => {
  res.status(200).json({ message: "Super Admin Area " });
});




router.post("/add-user", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  const { email } = req.body;

  try {
    const result = await addAdminUser(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});



router.get("/delete-user", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  const { email } = req.body;

  try {
    const result = await RemoveAdmin(email);
    res.status(200).json(result);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})



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


  try {
    const result = await createInvoice(invoicedetails);
    res.status(200).json(result);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }


})
router.delete("/delete-invoices", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

  try {
    const result = await getAllInvoices(id);
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




//quotations details

router.get("/getAll-quotations", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

})
router.post("/Create-quotations", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {

})
router.delete("/delete-quotations", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {


})
router.put("/update-quotations", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {


})






module.exports = router;
