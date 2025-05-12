







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


module.exports = {getAllInvoices,createInvoice ,deleteInvoice,updateInvoice};