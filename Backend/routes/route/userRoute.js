const { registerUser, loginUser } = require("../../controllers/userAuthController"); 
const {getUserProfile,addAdminUser, RemoveAdmin, getadminDetails,updateInvoiceState} = require("../../controllers/adminController");




const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {  
    const token = await loginUser(req.body);
    res.status(200).json(token);
  } catch (error) {
    res.status(401).json({ message:error.message });
  }
};


const getProfile = async (req, res) => {
  try {
<<<<<<< HEAD
    console.log(req.body);
    const profile = await getUserProfile(req.body.userID); 
=======
    const userID = req.headers.userid; // Get userID from body, not headers
    if (!userID) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const profile = await getUserProfile(userID);
>>>>>>> 70016798a0f1c75ef84ca62e493a838c73841079
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getAdminDashboard = async (req, res) => {
  try {
    
    const data = await getadminDetails();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAdmin = async (req, res) => {
  try {
    const result = await addAdminUser(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const result = await RemoveAdmin(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const State = async (req, res) => {
  try {
    const result = await updateInvoiceState( req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAdminDashboard,
  addAdmin,
  removeAdmin,
  State
};
