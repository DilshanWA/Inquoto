const {db} = require("../config/firebase");











async function Createinvoice(invoicedata) {
    if ( !invoicedata.uid) {
        throw new Error("Invoice data is required: customerName and amount are mandatory");
      }
    
      try {
        // 1. Generate a unique invoice ID using the current date and time (format: YYYYMMDDHHMM)
        const now = new Date();
        const invoiceId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    
        // 2. Add a new invoice document to the "invoices" collection with the generated invoice ID
        const newInvoiceRef = await db.collection("invoices").doc(invoiceId).set({
          ...invoiceId, // Spread the invoice data from the request
          createdAt: new Date(), // Timestamp when the invoice is created
          status: "pending", // Default status
        });

        db.collection('invoices').doc(invoiceId).set({
              
          invoiceId: invoiceId,
          satatus : invoicedata.status,
          userID : invoicedata.uid

        })
    
        // 3. Return the new invoice's document ID and data
        return {
          success: true,
          message: "Invoice created successfully",
          invoice: {
            id: invoiceId, // Use the custom invoice ID
            ...invoiceId,
            createdAt: new Date(), // Add createdAt timestamp
            status: "pending", // Default status
          },
        };
      } catch (error) {
        console.error("Error creating invoice:", error);
        throw new Error("Failed to create invoice");
      }
}






async function updateInvoice(oldInvoiceId, updatedData, uid) {
  if (!oldInvoiceId || !uid) {
    throw new Error("Old invoice ID and user UID are required.");
  }

  try {
    const oldInvoiceRef = db.collection('invoices').doc(oldInvoiceId);
    const oldDoc = await oldInvoiceRef.get();

    if (!oldDoc.exists) {
      throw new Error("Original invoice not found.");
    }

    const oldInvoice = oldDoc.data();

    //  Check permission
    if (oldInvoice.userID !== uid) {
      throw new Error("Unauthorized: You can only update your own invoices.");
    }

    //  Generate new invoiceId
    const now = new Date();
    const newInvoiceId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    //  Build new invoice data
    const allowedFields = ['status', 'amount', 'customerName'];
    const sanitizedUpdate = {};

    for (const key of allowedFields) {
      if (key in updatedData) {
        sanitizedUpdate[key] = updatedData[key];
      }
    }

    const newInvoiceData = {
      ...oldInvoice,
      ...sanitizedUpdate,
      invoiceId: newInvoiceId,
      updatedFrom: oldInvoiceId,
      updatedAt: now,
    };

    //  Save new version as new document
    await db.collection('invoices').doc(newInvoiceId).set(newInvoiceData);

    // (Optional) Mark old one as archived or superseded
    await oldInvoiceRef.update({ supersededBy: newInvoiceId });

    return {
      success: true,
      message: "Invoice updated as a new version",
      invoice: newInvoiceData,
    };

  } catch (error) {
    console.error("Invoice update failed:", error.message);
    throw new Error(error.message);
  }
}





async function DeleteInvoice(invoiceId, uid) {
  if (!invoiceId || !uid) {
    throw new Error("Invoice ID and user UID are required.");
  }

  try {
    const invoiceRef = db.collection('invoices').doc(invoiceId);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      throw new Error("Invoice not found.");
    }

    const invoice = doc.data();

    //  Check if the user is the creator
    if (invoice.userID !== uid) {
      throw new Error("Unauthorized: You can only delete your own invoices.");
    }

    //  Delete the invoice
    await invoiceRef.delete();

    return {
      success: true,
      message: "Invoice deleted successfully.",
      deletedInvoiceId: invoiceId,
    };

  } catch (error) {
    console.error("Error deleting invoice:", error.message);
    throw new Error(error.message);
  }
}










//CreateQuotation

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



async function CreateQuotation(quotationData) {
  if (!quotationData.uid) {
    throw new Error("Quotation data is required: uid is mandatory");
  }

  try {
    const now = new Date();
    const quotationId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    const newQuotation = {
      ...quotationData,
      quotationId,
      createdAt: now,
      status: "pending",
      userID: quotationData.uid,
    };

    await db.collection("quotations").doc(quotationId).set(newQuotation);

    return {
      success: true,
      message: "Quotation created successfully",
      quotation: newQuotation,
    };
  } catch (error) {
    console.error("Error creating quotation:", error);
    throw new Error("Failed to create quotation");
  }
}




async function UpdateQuotation(oldQuotationId, updatedData, uid) {
  if (!oldQuotationId || !uid) {
    throw new Error("Old quotation ID and user UID are required.");
  }

  try {
    const oldRef = db.collection('quotations').doc(oldQuotationId);
    const oldDoc = await oldRef.get();

    if (!oldDoc.exists) {
      throw new Error("Original quotation not found.");
    }

    const oldData = oldDoc.data();

    // Permission check
    if (oldData.userID !== uid) {
      throw new Error("Unauthorized: You can only update your own quotations.");
    }

    // Generate new quotation ID
    const now = new Date();
    const newQuotationId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // Sanitize update fields
    const allowedFields = ['status', 'items', 'total', 'customerName'];
    const sanitizedUpdate = {};

    for (const key of allowedFields) {
      if (key in updatedData) {
        sanitizedUpdate[key] = updatedData[key];
      }
    }

    const newQuotationData = {
      ...oldData,
      ...sanitizedUpdate,
      quotationId: newQuotationId,
      updatedFrom: oldQuotationId,
      updatedAt: now,
    };

    // Save new version
    await db.collection('quotations').doc(newQuotationId).set(newQuotationData);

    // Mark old one
    await oldRef.update({ supersededBy: newQuotationId });

    return {
      success: true,
      message: "Quotation updated as a new version",
      quotation: newQuotationData,
    };

  } catch (error) {
    console.error("Quotation update failed:", error.message);
    throw new Error(error.message);
  }
}




async function DeleteQuotation(quotationId, uid) {
  if (!quotationId || !uid) {
    throw new Error("Quotation ID and user UID are required.");
  }

  try {
    const ref = db.collection('quotations').doc(quotationId);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new Error("Quotation not found.");
    }

    const data = doc.data();

    // Check if user is owner
    if (data.userID !== uid) {
      throw new Error("Unauthorized: You can only delete your own quotations.");
    }

    // Delete quotation
    await ref.delete();

    return {
      success: true,
      message: "Quotation deleted successfully.",
      deletedQuotationId: quotationId,
    };

  } catch (error) {
    console.error("Error deleting quotation:", error.message);
    throw new Error(error.message);
  }
}





module.exports = {
  Createinvoice ,updateInvoice, DeleteInvoice,getAllInvoices,
  CreateQuotation , UpdateQuotation , DeleteQuotation ,getAllQuotations

}