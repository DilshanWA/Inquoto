const express = require("express");
const router = express.Router();

const { Login, getProfile } = require("../controllers/userController");

const {Createinvoice} = require("../utils/adminFun");


//login
router.post("/login", Login);


router.get("/admin-dashboard", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({ message: "Super Admin Area " });
});



//invoice function
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



router.put("/Update-invoices", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({ message: "Super Admin Area " });
});
router.delete("/Delete-invoices", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({ message: "Super Admin Area " });
});


//Create quotations
router.post("/Create-quotations", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({ message: "Super Admin Area " });
});
router.put("/Update-quotations", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({ message: "Super Admin Area " });
});
router.delete("/Delete-quotations", authMiddleware, roleMiddleware("admin"), (req, res) => {
    res.status(200).json({ message: "Super Admin Area " });
});



module.exports = router;