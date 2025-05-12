


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
  


module.exports = {createQuotation,getAllQuotations,updateQuotation,deleteQuotation,};