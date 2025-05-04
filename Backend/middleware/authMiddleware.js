const { default: axios } = require("axios");
const { admin } = require("../config/firebase");

require('dotenv').config();

//Register user

const Register = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    return res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
     
    });
   

  } catch (error) {

    console.error("Firebase error:", error);


    return res.status(500).json({
      message: "Error: Registration failed",
      error: error.message,
    });
  }
};





//Login

const Login = async (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {

   const firebaseApiKey = process.env.FIREBASEAPIKEY;
   const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
   );

   return res.status(200).json({
    message: "Login successful",
    idToken: response.data.idToken,
    uid: response.data.localId,
  });
    
  } catch (error) {
    return res.status(401).json({
      message: "Login failed",
      error: error.response?.data?.error?.message || error.message,
    });  }

}

module.exports = { Register, Login }
