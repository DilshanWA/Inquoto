const {db} = require("../config/firebase");

require('dotenv').config();

//Quotaions---------

async function createQuotation(quotationData) {
    if (!quotationData) {
      throw new Error("Quotation data is required");
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
  


  
  
  async function updateQuotation(updatedData, userEmail) {
    if (!updatedData || !updatedData.quotationId) {
      throw new Error("Quotation ID and updated data are required");
    }
  
    const role = userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";
  
    try {
      const oldRef = db.collection("quotations").doc(updatedData.quotationId);
      const oldDoc = await oldRef.get();
  
      if (!oldDoc.exists) {
        return { success: false, message: "Original quotation not found" };
      }
  
      const oldData = oldDoc.data();
  
      // Check permission for admins (not super_admin)
      if (role !== "super_admin" && oldData.customerEmail !== userEmail) {
        return { success: false, message: "Permission denied. You can only update your own quotations." };
      }
  
      const now = new Date();
      const newQuotationId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  
      // Create new quotation as updated version
      const updatedQuotation = {
        ...oldData,
        ...updatedData,
        quotationId: newQuotationId,
        updatedAt: now.toISOString(),
        originalQuotationId: updatedData.quotationId, // Keep reference to original
        updatedBy: userEmail,
      };
  
      await db.collection("quotation_updates").doc(newQuotationId).set(updatedQuotation);
  
      return {
        success: true,
        message: "Quotation updated successfully and saved as new record",
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