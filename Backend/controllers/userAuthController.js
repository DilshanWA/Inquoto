const { default: axios } = require("axios");
const { admin ,db} = require("../config/firebase");




require('dotenv').config();

//Register user

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email, name, and password are required" });
  }

  try {
    //  Determine role
    const role = email === process.env.SUPERADMIN ? "super_admin" : "admin";

    //  Check Firestore for existing user by email
    const userDocSnap = await db.collection("Addusers").where("email", "==", email).limit(1).get();

    //  Allow super_admin even if not in Firestore
    if (userDocSnap.empty && role !== "super_admin") {
      return res.status(403).json({
        message: "This email is not approved by Super Admin",
      });
    }

    //  If user exists in Firestore, validate their role and state
    if (!userDocSnap.empty) {
      const userData = userDocSnap.docs[0].data();

      if (userData.register_sate === true) {
        return res.status(400).json({ 
          register_sate:userData.register_sate,
          message: role ==='super_admin'?'your superadmin account already created please login': "you already have account" });
      }

      if (userData.role !== "Admin" && role !== "super_admin") {
        console.log(userData.role);
        return res.status(403).json({ message: "Unauthorized role" });
      }
    }

    //  Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    //  Save or update Firestore user document
    await db.collection("users").doc(userRecord.uid).set({
      email,
      name,
      role,
      register_sate: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("Addusers").doc(email).set({
      state: 'Acept',
      name :name,
      reg_date :new Date().toISOString('en-GB')
    }, { merge: true });
    
    
    console.log('Registered.')
    return res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
      role,
      register_sate: true,
      name:name
    });

  } catch (error) {
    console.error("Firebase error:", error);

    return res.status(500).json({
      message: "Error: Registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


//Login

const loginUser = async (req, res, next) => {
   
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const role = email === process.env.SUPERADMIN ? "super_admin" : "admin";

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
   console.log("Login successful");

   return res.status(200).json({
    message: "Login successful",
    role:role,
    idToken: response.data.idToken,
    uid: response.data.localId,
  
  });
  
  } catch (error) {
    return res.status(401).json({
      message: "Login failed",
      error: error.response?.data?.error?.message || error.message,
    });  }

}

module.exports = { loginUser ,registerUser}
