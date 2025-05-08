// models/UserModel.js

const createUserModel = ({ uid, email, name = "", role = "Admin"}) => {
    return {
      uid,                          // Firebase Auth UID
      email,                        // User's email
      name,                         // Optional name
      role,                         // Optional: admin / user / etc.                
      createdAt: new Date(),        // Timestamp
    };
  };
  
  module.exports = createUserModel;
  