const {admin,db} = require("../config/firebase");

const nodemailer = require("nodemailer");
const path = require("path");

require('dotenv').config();


const LOGIN_REDIRECT_URL = "https://your-app.com/admin-login";
//  Determine role



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MyEMAIL,
    pass: process.env.PASSWORD, 
  },
});

/**
 * Add user with admin role and send magic login link
 * @param {string} email 
 */




//Get profile data


async function getUserProfile(data) {
  try {
    // 🚫 Check if user ID is missing
    if (!data || typeof data !== 'string') {
      throw new Error('Invalid user ID');
    }

    // 1. Get user profile by ID
    const userRef = db.collection('users').doc(data);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();

    // 2. Total Users Count
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // 3. Pending Approvals Count
    const pendingSnapshot = await db.collection('users')
      .where('register_state', '==', 'pending')
      .get();
    const pendingApprovals = pendingSnapshot.size;

    // 4. Quotations for this user
    const quotationsSnapshot = await db.collection('quotations')
      .where('userID', '==', data)
      .get();
    const totalQuotations = quotationsSnapshot.size;

    // 5. Invoices for this user
    const invoicesSnapshot = await db.collection('invoices')
      .where('userID', '==', data)
      .get();
    const totalInvoices = invoicesSnapshot.size;

    return {
      success: true,
      profile: {
        email: userData.email,
        name: userData.name,
        register_state: userData.register_state,
        role: userData.role,
        createdAt: userData.createdAt,
      },
      stats: {
        totalUsers,
        pendingApprovals,
        totalQuotations,
        totalInvoices
      }
    };

  } catch (error) {
    console.error('Error fetching user profile or stats:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch user profile and statistics',
    };
  }
}








async function getadminDetails() {
  try {
    const snapshot = await db.collection("Addusers").get();

    const admins = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data: admins
    };
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return {
      success: false,
      message: "Failed to fetch admin details",
      error: error.message
    };
  }
}


async function addAdminUser(email) {
  if (!email) throw new Error("Email is required");
   try{
    db.collection('Addusers').doc(email).set({
      name:'admin',
      email:email,
      role:'Admin',
      state: 'pending',
    })

    // 4. Send login link via email
await transporter.sendMail({
  from: 'QuantifyPro Admin Team',
  to: email,
  subject: "Your Admin Access Link - QuantifyPro",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <img src="cid:QuantifyProLogo" alt="QuantifyPro Logo" style="width: 100px; margin-bottom: 20px;" />
      <h2 style="color: #333;">Welcome to QuantifyPro Admin Panel 🎉</h2>
      <p style="color: #555;">Hi there,</p>
      <p style="color: #555;">
        You've been granted admin access to the QuantifyPro platform. Use the secure button below to sign in and manage your dashboard.
      </p>
      <a href="${null}" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Click here to Login
      </a>
      <p style="color: #888; font-size: 14px;">Note: This link is valid for 24 hours and can only be used once.</p>
      <hr style="margin: 30px 0;">
      <p style="color: #aaa; font-size: 12px;">If you did not expect this email, please ignore it. This is an automated message from QuantifyPro.</p>
    </div>
  `,
  attachments: [
    {
      filename: 'logo.png',
      path: path.join(__dirname, '../assets/logo.png'), // 👈 no require(), just path
      cid: 'QuantifyProLogo' // this matches <img src="cid:QuantifyProLogo" />
    }
  ]
});



     console.log('added')
    return { success: true, message: "Admin added and email sent" };
  } catch (err) {
    console.error("Error adding admin user:", err);
    throw new Error("Failed to add admin user");
  }
}



async function RemoveAdmin(email) {
  if (!email) throw new Error("Email is required");

  try {
    // 1. Get the user's document from 'adduser'
    const userDoc = await db.collection("Addusers").doc(email).get();

    if (!userDoc.exists) {
      throw new Error("User not found in adduser collection");
    }

    const userData = userDoc.data();
    let user = null;

    try {
      // Try to get user from Firebase Auth
      user = await admin.auth().getUserByEmail(email);

      if (userData.state === 'accept') {
        // Remove custom claims
        await admin.auth().setCustomUserClaims(user.uid, { role: null });

        // Delete from 'users' collection
        await db.collection("users").doc(user.uid).delete();

        // Delete from Firebase Auth (optional)
        await admin.auth().deleteUser(user.uid);
      }
    } catch (error) {
      if (userData.state === 'accept') {
        throw new Error("User not found in Firebase Auth, but marked as accepted");
      }
      // if pending, continue silently
    }

    // 3. Delete from 'adduser' collection
    await db.collection("Addusers").doc(email).delete();

    // 4. Send notification email
    await transporter.sendMail({
      from: '"Your App Admin" <yourEmail@gmail.com>',
      to: email,
      subject: "Your Admin Role Has Been Removed",
      html: `
        <h2>Hello!</h2>
        <p>Your admin role has been removed from the Admin Panel.</p>
        <p>If this was a mistake, please contact support.</p>
      `,
    });

    return { success: true, message: "Admin removed and email sent" };
  } catch (error) {
    console.error("Error removing admin:", error);
    throw new Error("Failed to remove admin");
  }
}



async function updateInvoiceState(Data) {
  if (!Data.invoiceID || !Data.updatedData?.state || !Data.userEmail || !Data.type) {
    throw new Error("Document ID, new state, user email, and type are required");
  }

  const role = Data.userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";

  // Choose the collection based on type
  const collectionName = Data.type === "quotations" ? "quotations" : "invoices";

  try {
    // 1. Reference the correct document
    const docRef = db.collection(collectionName).doc(Data.invoiceID);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return { success: false, message: `${Data.type} not found` };
    }

    // 2. Only super admin can update the state directly
    if (role !== "super_admin") {
      return {
        success: false,
        message: "Permission denied: only super admin can update state",
      };
    }

    // 3. Update only the 'state' field
    await docRef.update({
      status: Data.updatedData.state,
      updatedAt: new Date().toISOString(),
      updatedBy: Data.userEmail,
    });

    return {
      success: true,
      message: `${Data.type} state updated to "${Data.updatedData.state}"`,
      id: Data.id,
    };

  } catch (error) {
    console.error(`Error updating ${Data.type} state:`, error);
    throw new Error(`Failed to update ${Data.type} state`);
  }
}




module.exports = {

  addAdminUser , RemoveAdmin,
  getadminDetails ,getUserProfile,
  updateInvoiceState
};
