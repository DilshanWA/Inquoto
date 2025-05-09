
const {admin,db} = require("../config/firebase");
const nodemailer = require("nodemailer");

require('dotenv').config();







//Create invoice

async function createInvoice(invoiceData,uid) {
  if (!invoiceData || !invoiceData.customerName || !invoiceData.customerAddress || invoiceData.date || invoiceData.items || invoiceData.terms || invoiceData.total) {
    throw new Error("Invoice data is required: customerName and amount are mandatory");
  }

  try {
    // 1. Generate a unique invoice ID using the current date and time (format: YYYYMMDDHHMM)
    const now = new Date();
    const invoiceId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // 2. Add a new invoice document to the "invoices" collection with the generated invoice ID
    const newInvoiceRef = await db.collection("invoices").doc(invoiceId).set({
      ...invoiceData, // Spread the invoice data from the request
      createdAt: new Date(), // Timestamp when the invoice is created
      status: "pending", // Default status
    });

    db.collection('invoices').doc(invoiceId).set({
        invoiceId: invoiceId,
        satatus : invoiceData.customerName,
        userID :uid
    })

    // 3. Return the new invoice's document ID and data
    return {
      success: true,
      message: "Invoice created successfully",
      invoice: {
        id: invoiceId, // Use the custom invoice ID
        ...invoiceData,
        createdAt: new Date(), // Add createdAt timestamp
        status: "pending", // Default status
      },
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw new Error("Failed to create invoice");
  }
}


module.exports = {createInvoice};