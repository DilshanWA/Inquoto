const express = require("express");
const router = express.Router();

const { Login,Register, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { addAdminUser, RemoveAdmin ,getadminDetails} = require("../utils/superAdminFun");



//Register
router.post("/Register",Register );

//login
router.post("/login", Login);



//  Protected Route - Any authenticated user

// router.get("/profile", authMiddleware,roleMiddleware("super_admin"), getProfile);

router.get("/super-dashboard", authMiddleware, roleMiddleware("super_admin"), async(req, res) => {
  try {
    const result = await getadminDetails();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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



router.delete("/delete-user/:id", authMiddleware, roleMiddleware("super_admin"), async (req, res) => {
  

  try {
    const result = await RemoveAdmin(req.params.id);
    res.status(200).json(result);


  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})









module.exports = router;
