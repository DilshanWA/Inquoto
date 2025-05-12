const { default: axios } = require("axios");
const { admin ,db} = require("../config/firebase");



require('dotenv').config();

//Register user

const registerUser = async (data) => {

  if (!data.email || !data.password || !data.name) {
    return ({ message: "Email, name, and password are required" });
  }

  try {
    //  Determine role
    const role = data.email === process.env.SUPERADMIN ? "super_admin" : "admin";

    //  Check Firestore for existing user by email
    const userDocSnap = await db.collection("Addusers").where("email", "==", data.email).limit(1).get();

    //  Allow super_admin even if not in Firestore
    if (userDocSnap.empty && role !== "super_admin") {
      return ({
        message: "This email is not approved by Super Admin",
      });
    }

    //  If user exists in Firestore, validate their role and state
    if (!userDocSnap.empty) {
      const userData = userDocSnap.docs[0].data();

      if (userData.register_sate === true) {
        return ({ 
          register_sate:userData.register_sate,
          message: role ==='super_admin'?'your superadmin account already created please login': "you already have account" });
      }

      if (userData.role !== "Admin" && role !== "super_admin") {
        console.log(userData.role);
        return ({ message: "Unauthorized role" });
      }
    }

    //  Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email:data.email,
      password:data.password,
    });

    //  Save or update Firestore user document
    await db.collection("users").doc(userRecord.uid).set({
      email:data.email,
      name:data.name,
      role,
      register_sate: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("Addusers").doc(email).set({
      state: 'Acept',
      name :data.name,
      reg_date :new Date().toISOString('en-GB')
    }, { merge: true });
    
    
    console.log('Registered.')
    return ({
      message: "User created successfully",
      uid: userRecord.uid,
      role,
      register_sate: true,
      name:data.name
    });

  } catch (error) {
    console.error("Firebase error:", error);

    return ({
      message: "Error: Registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};





//Login

const loginUser = async (data) => {
    
  if (!data.email || !data.password) {
    return ({ message: "Email and password are required" });
  }

  const role = data.email === process.env.SUPERADMIN ? "super_admin" : "admin";

  try {

   const firebaseApiKey = process.env.FIREBASEAPIKEY;
   const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
    {
      email:data.email,
      password:data.password,
      returnSecureToken: true,
    }
   );
   console.log("Login successful");

   return ({
    message: "Login successful",
    role:role,
    idToken: response.data.idToken,
    uid: response.data.localId,
  
  });
  
  } catch (error) {
    return ({
      message: "Login failed",
      error: error.response?.data?.error?.message || error.message,
    });  }

}

module.exports = { loginUser ,registerUser}
