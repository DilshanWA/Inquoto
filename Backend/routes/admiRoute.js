const express = require("express");
const router = express.Router();

const { Login, getProfile } = require("../controllers/userController");


//login
router.post("/login", Login);






module.exports =router;