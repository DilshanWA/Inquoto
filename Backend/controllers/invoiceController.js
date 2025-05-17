const {db} = require("../config/firebase");



//Create invoice

async function createInvoice(invoiceData) {
  if (!invoiceData) {
    throw new Error("Invoice data is required");
  }

  try {
    // 1. Generate unique invoice ID: YYYYMMDDHHMM
    const now = new Date();
    const invoiceId = `INV ${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // 2. Create the full invoice object with all expected fields
    const fullInvoice = {
      invoiceId,
      createdAt: now.toISOString(),
      customerName: invoiceData.customerName,
      customerAddress: invoiceData.customerAddress || '',
      date: invoiceData.date || '',
      validity: invoiceData.validity || '',
      items: invoiceData.items || [],
      note: invoiceData.note || '',
      terms: invoiceData.terms || '',
      total: invoiceData.total,
      status: invoiceData.status || 'pending',
      userID: invoiceData.uid || null,
      userName:invoiceData.userName ||null
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
async function updateInvoice(Data) {
  if (!Data.invoiceId || !Data.updatedData || !Data.userEmail) {
    throw new Error("Invoice ID, updated data, and user email are required");
  }

  const role = Data.userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";

  try {
    // 1. Get the original invoice
    const oldInvoiceRef = db.collection("invoices").doc(Data.invoiceId);
    const oldInvoiceDoc = await oldInvoiceRef.get();

    if (!oldInvoiceDoc.exists) {
      return { success: false, message: "Original invoice not found" };
    }

    const oldData = oldInvoiceDoc.data();

    // 2. Check permission
    if (role !== "super_admin" && oldData.userID !== userEmail) {
      return { success: false, message: "Permission denied: you can only update your own invoices" };
    }

    // 3. Generate new invoice ID
    const now = new Date();
    const newInvoiceId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // 4. Prepare updated invoice
    const updatedInvoice = {
      ...oldData,
      ...Data.updatedData,
      invoiceId: newInvoiceId,
      updatedAt: now.toISOString(),
      updatedBy: Data.userEmail,
      originalInvoiceId: Data.invoiceId, // Track original invoice
    };

    // 5. Save as a new document
    await db.collection("invoices").doc(newInvoiceId).set(updatedInvoice);

    return {
      success: true,
      message: "Invoice updated successfully and saved as a new record",
      newInvoiceId,
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw new Error("Failed to update invoice");
  }
}


async function updateInvoiceState(Data) {
  if (!Data.invoiceId || !Data.updatedData?.state || !Data.userEmail) {
    throw new Error("Invoice ID, new state, and user email are required");
  }

  const role = Data.userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";

  try {
    // 1. Reference the invoice document
    const invoiceRef = db.collection("invoices").doc(Data.invoiceId);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return { success: false, message: "Invoice not found" };
    }

    // 2. Only super admin can update the state directly
    if (role !== "super_admin") {
      return {
        success: false,
        message: "Permission denied: only super admin can update invoice state",
      };
    }

    // 3. Update only the 'state' field
    await invoiceRef.update({
      status: Data.updatedData.state,
      updatedAt: new Date().toISOString(),
      updatedBy: Data.userEmail,
    });

    return {
      success: true,
      message: `Invoice state updated to "${Data.updatedData.state}"`,
      invoiceId: Data.invoiceId,
    };

  } catch (error) {
    console.error("Error updating invoice state:", error);
    throw new Error("Failed to update invoice state");
  }
}



// Delete invoice by ID
async function deleteInvoice(data) {
  if (!data.invoiceId && !data.userEmail) throw new Error("Invoice ID Or Email is Miss");


  const role = data.userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";

  try {
    const invoiceRef = db.collection("invoices").doc(data.invoiceId);
    const doc = await invoiceRef.get();

    if (!doc.exists) {
      return { success: false, message: "Invoice not found" };
    }

    const invoiceData = doc.data();

    // 🔒 Admins can only delete their own invoices
    if (role !== "super_admin" && invoiceData.userEmail !== data.userEmail) {
      return { success: false, message: "Permission denied: you can only delete your own invoices" };
    }

    await invoiceRef.delete();

    return { success: true, message: "Invoice deleted successfully" };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw new Error("Failed to delete invoice");
  }
}



module.exports = {getAllInvoices,createInvoice ,deleteInvoice,updateInvoice,updateInvoiceState};