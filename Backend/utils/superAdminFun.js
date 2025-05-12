const {admin,db} = require("../config/firebase");
const nodemailer = require("nodemailer");

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
      date:new Date()
    })

    // 4. Send login link via email
await transporter.sendMail({
  from: '"Inquoto Admin Team" <yourEmail@gmail.com>',
  to: email,
  subject: "Your Admin Access Link - Inquoto",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #333;">Welcome to Inquoto Admin Panel 🎉</h2>
      <p style="color: #555;">Hi there,</p>
      <p style="color: #555;">
        You've been granted admin access to the Inquoto platform. Use the secure button below to sign in and manage your dashboard.
      </p>
      <a href="${null}" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Click here to Login
      </a>
      <p style="color: #888; font-size: 14px;">Note: This link is valid for 24 hours and can only be used once.</p>
      <hr style="margin: 30px 0;">
      <p style="color: #aaa; font-size: 12px;">If you did not expect this email, please ignore it. This is an automated message from Inquoto.</p>
    </div>
  `,
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






//Create invoice

async function createInvoice(invoiceData) {
  if (!invoiceData || !invoiceData.customerName || !invoiceData.total) {
    throw new Error("Invoice data is required: customerName and total are mandatory");
  }

  try {
    // 1. Generate unique invoice ID: YYYYMMDDHHMM
    const now = new Date();
    const invoiceId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // 2. Create the full invoice object with all expected fields
    const fullInvoice = {
      invoiceId,
      createdAt: now,
      customerName: invoiceData.customerName,
      customerAddress: invoiceData.customerAddress || '',
      date: invoiceData.date || '',
      validity: invoiceData.validity || '',
      items: invoiceData.items || [],
      note: invoiceData.note || '',
      terms: invoiceData.terms || '',
      total: invoiceData.total,
      status: invoiceData.status || 'pending',
      userID: invoiceData.uid || null
    };

    // 3. Save to Firestore
    await db.collection("invoices").doc(invoiceId).set(fullInvoice);

    // 4. Return response
    return {
      success: true,
      message: "Invoice created successfully",
      invoice: fullInvoice,
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw new Error("Failed to create invoice");
  }
}




//invoice function

async function getAllInvoices() {
  try {
    // 1. Get all invoices from the "invoices" collection
    const snapshot = await db.collection("invoices").get();

    // 2. Check if the collection is empty
    if (snapshot.empty) {
      return { success: false, message: "No invoices found" };
    }

    // 3. Map over the snapshot to extract data from each document
    const invoices = snapshot.docs.map(doc => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    }));

    return { success: true, invoices };
  } catch (error) {
    console.error("Error getting invoices:", error);
    throw new Error("Failed to get invoices");
  }
}


// Update invoice by creating a new one with updated data
async function updateInvoice(oldInvoiceId, updatedData) {
  if (!oldInvoiceId || !updatedData) throw new Error("Invoice ID and updated data are required");

  try {
    // 1. Get the original invoice
    const oldInvoiceRef = db.collection("invoices").doc(oldInvoiceId);
    const oldInvoiceDoc = await oldInvoiceRef.get();

    if (!oldInvoiceDoc.exists) {
      return { success: false, message: "Original invoice not found" };
    }

    // 2. Generate new invoice ID based on current date and time
    const now = new Date();
    const newInvoiceId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // 3. Create a new invoice document with updated data
    await db.collection("invoices").doc(newInvoiceId).set({
      ...oldInvoiceDoc.data(), // Preserve old data
      ...updatedData,         // Overwrite with updated fields
      updatedAt: now.toISOString(), // Optional: Track update time
    });

    return {
      success: true,
      message: "Invoice updated by creating a new record",
      newInvoiceId,
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw new Error("Failed to update invoice");
  }
}





// Delete invoice by ID
async function deleteInvoice(invoiceId) {
  if (!invoiceId) throw new Error("Invoice ID is required");

  try {
    // 1. Reference the document in the 'invoices' collection
    const invoiceRef = db.collection("invoices").doc(invoiceId);

    // 2. Check if the document exists
    const doc = await invoiceRef.get();
    if (!doc.exists) {
      return { success: false, message: "Invoice not found" };
    }

    // 3. Delete the document
    await invoiceRef.delete();

    return { success: true, message: "Invoice deleted successfully" };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw new Error("Failed to delete invoice");
  }
}









//Quotaions---------

async function createQuotation(quotationData) {
  if (!quotationData || !quotationData.customerName || !quotationData.items || !quotationData.total) {
    throw new Error("Quotation data is required: customerName, items, and total are mandatory");
  }

  try {
    const now = new Date();
    const quotationId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    await db.collection("quotations").doc(quotationId).set({
      ...quotationData,
      quotationId: quotationId,
      createdAt: now,
      status: quotationData.status || "pending",
    });

    return {
      success: true,
      message: "Quotation created successfully",
      quotation: {
        id: quotationId,
        ...quotationData,
        createdAt: now,
        status: quotationData.status || "pending",
      },
    };
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error("Failed to create quotation");
  }
}



async function getAllQuotations() {
  try {
    const snapshot = await db.collection("quotations").get();

    if (snapshot.empty) {
      return { success: false, message: "No quotations found" };
    }

    const quotations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, quotations };
  } catch (error) {
    console.error("Error getting quotations:", error);
    throw new Error("Failed to get quotations");
  }
}


async function updateQuotation(oldQuotationId, updatedData) {
  if (!oldQuotationId || !updatedData) {
    throw new Error("Quotation ID and updated data are required");
  }

  try {
    const oldRef = db.collection("quotations").doc(oldQuotationId);
    const oldDoc = await oldRef.get();

    if (!oldDoc.exists) {
      return { success: false, message: "Original quotation not found" };
    }

    const now = new Date();
    const newQuotationId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    await db.collection("quotations").doc(newQuotationId).set({
      ...oldDoc.data(),
      ...updatedData,
      updatedAt: now.toISOString(),
    });

    return {
      success: true,
      message: "Quotation updated by creating a new record",
      newQuotationId,
    };
  } catch (error) {
    console.error("Error updating quotation:", error);
    throw new Error("Failed to update quotation");
  }
}


async function deleteQuotation(quotationId) {
  if (!quotationId) throw new Error("Quotation ID is required");

  try {
    const ref = db.collection("quotations").doc(quotationId);
    const doc = await ref.get();

    if (!doc.exists) {
      return { success: false, message: "Quotation not found" };
    }

    await ref.delete();

    return { success: true, message: "Quotation deleted successfully" };
  } catch (error) {
    console.error("Error deleting quotation:", error);
    throw new Error("Failed to delete quotation");
  }
}




module.exports = {
  addAdminUser , RemoveAdmin,
  getAllInvoices,createInvoice ,deleteInvoice,updateInvoice,
  createQuotation,getAllQuotations,updateQuotation,deleteQuotation,
  getadminDetails
};
