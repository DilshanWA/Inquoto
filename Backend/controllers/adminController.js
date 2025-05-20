const {admin,db} = require("../config/firebase");

const nodemailer = require("nodemailer");
const path = require("path");

require('dotenv').config();


const LOGIN_REDIRECT_URL = "https://your-app.com/admin-login";

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

<<<<<<< HEAD



//Get profile data


async function getUserProfile(userId) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    // 1. Get user profile
=======
async function getUserProfile(userId) {
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    // === 1. Get user profile ===
>>>>>>> 70016798a0f1c75ef84ca62e493a838c73841079
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    const userData = userDoc.data();

<<<<<<< HEAD
    // 2. Basic counts
=======
    // === 2. Basic counts ===
>>>>>>> 70016798a0f1c75ef84ca62e493a838c73841079
    const [usersSnapshot, pendingUsersSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('users').where('register_state', '==', 'pending').get()
    ]);
<<<<<<< HEAD
    const totalUsers = usersSnapshot.size;
    const pendingApprovals = pendingUsersSnapshot.size;

    // 3. Quotations & Invoices for this user
    const [
      allQuotations, allInvoices,
      pendingQuotations, pendingInvoices,
      completeQuotations, completeInvoices,
      approvedQuotations, approvedInvoices,
      rejectedQuotations, rejectedInvoices
    ] = await Promise.all([
      db.collection('quotations').where('userID', '==', userId).get(),
      db.collection('invoices').where('userID', '==', userId).get(),

      db.collection('quotations').where('userID', '==', userId).where('status', '==', 'pending').get(),
      db.collection('invoices').where('userID', '==', userId).where('status', '==', 'pending').get(),

      db.collection('quotations').where('userID', '==', userId).where('status', '==', 'complete').get(),
      db.collection('invoices').where('userID', '==', userId).where('status', '==', 'complete').get(),

      db.collection('quotations').where('userID', '==', userId).where('status', '==', 'approved').get(),
      db.collection('invoices').where('userID', '==', userId).where('status', '==', 'approved').get(),

      db.collection('quotations').where('userID', '==', userId).where('status', '==', 'rejected').get(),
      db.collection('invoices').where('userID', '==', userId).where('status', '==', 'rejected').get()
    ]);

=======

    const totalUsers = usersSnapshot.size;
    const pendingApprovals = pendingUsersSnapshot.size;

    // === 3. Quotation and Invoice stats (user-specific and global) ===
    const statusList = ['Pending', 'Completed', 'Approved', 'Rejected'];

    const userQuotationsPromises = statusList.map(status =>
      db.collection('quotations').where('userID', '==', userId).where('status', '==', status).get()
    );
    const userInvoicesPromises = statusList.map(status =>
      db.collection('invoices').where('userID', '==', userId).where('status', '==', status).get()
    );
    const allUserQuotations = db.collection('quotations').where('userID', '==', userId).get();
    const allUserInvoices = db.collection('invoices').where('userID', '==', userId).get();

    const globalQuotationsPromises = statusList.map(status =>
      db.collection('quotations').where('status', '==', status).get()
    );
    const globalInvoicesPromises = statusList.map(status =>
      db.collection('invoices').where('status', '==', status).get()
    );
    const allGlobalQuotations = db.collection('quotations').get();
    const allGlobalInvoices = db.collection('invoices').get();

    // Execute all promises and destructure results in order
    const results = await Promise.all([
      ...userQuotationsPromises,
      ...userInvoicesPromises,
      allUserQuotations,
      allUserInvoices,
      ...globalQuotationsPromises,
      ...globalInvoicesPromises,
      allGlobalQuotations,
      allGlobalInvoices
    ]);

    // Manually assign results to variables
    const userQuotations = results.slice(0, 4);
    const userInvoices = results.slice(4, 8);
    const allQuotationsSnapshot = results[8];
    const allInvoicesSnapshot = results[9];
    const globalQuotations = results.slice(10, 14);
    const globalInvoices = results.slice(14, 18);
    const totalGlobalQuotations = results[18];
    const totalGlobalInvoices = results[19];

>>>>>>> 70016798a0f1c75ef84ca62e493a838c73841079
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
<<<<<<< HEAD
        totalUsers,
        pendingApprovals,
        totalQuotations: allQuotations.size,
        totalInvoices: allInvoices.size,
        pendingQuotations: pendingQuotations.size,
        pendingInvoices: pendingInvoices.size,
        completeQuotations: completeQuotations.size,
        completeInvoices: completeInvoices.size,
        approvedQuotations: approvedQuotations.size,
        approvedInvoices: approvedInvoices.size,
        rejectedQuotations: rejectedQuotations.size,
        rejectedInvoices: rejectedInvoices.size,
        totalRejected: rejectedQuotations.size + rejectedInvoices.size,
=======
        users: {
          total: totalUsers,
          pending: pendingApprovals,
        },
        userData: {
          totalQuotations: allQuotationsSnapshot.size,
          totalInvoices: allInvoicesSnapshot.size,
          pendingQuotations: userQuotations[0].size,
          completeQuotations: userQuotations[1].size,
          approvedQuotations: userQuotations[2].size,
          rejectedQuotations: userQuotations[3].size,
          pendingInvoices: userInvoices[0].size,
          completeInvoices: userInvoices[1].size,
          approvedInvoices: userInvoices[2].size,
          rejectedInvoices: userInvoices[3].size,
        },
        globalData: {
          totalQuotations: totalGlobalQuotations.size,
          totalInvoices: totalGlobalInvoices.size,
          pendingQuotations: globalQuotations[0].size,
          completeQuotations: globalQuotations[1].size,
          approvedQuotations: globalQuotations[2].size,
          rejectedQuotations: globalQuotations[3].size,
          pendingInvoices: globalInvoices[0].size,
          completeInvoices: globalInvoices[1].size,
          approvedInvoices: globalInvoices[2].size,
          rejectedInvoices: globalInvoices[3].size,
        }
>>>>>>> 70016798a0f1c75ef84ca62e493a838c73841079
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


<<<<<<< HEAD







=======
>>>>>>> 70016798a0f1c75ef84ca62e493a838c73841079
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
