const { default: axios } = require("axios");
const { admin ,db} = require("../config/firebase");

const createUserModel = require ("../models/usermodel");


require('dotenv').config();

//Register user

// const Register = async (req, res, next) => {
//   const { email, password} = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }
//   try {
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//     });
    
//     // super admin 
//     const role = email === process.env.SUPERADMIN ? "super_admin" : "admin";

//     const userData = createUserModel({

//         email:email,
//         uid:userRecord.uid,
//         name:userRecord.name,
//         role:role
//     })

//     await db.collection("users").doc(userRecord.uid).set({
//         email: email,
//         role: role,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
  

//     return res.status(201).json({
//       message: "User created successfully",
//       uid: userRecord.uid,
//       role: role
     
//     });
   

//   } catch (error) {

//     console.error("Firebase error:", error);


//     return res.status(500).json({
//       message: "Error: Registration failed",
//       error: error.message,
//     });
//   }
// };





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
   console.log(response);

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

module.exports = { Login }
