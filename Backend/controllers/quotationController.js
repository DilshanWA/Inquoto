const {db} = require("../config/firebase");

require('dotenv').config();

//Quotaions---------

async function createQuotation(quotationData) {
    if (!quotationData) {
      throw new Error("Quotation data is required");
    }
  
    try {
      const now = new Date();
      const quotationId = `QUO${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  
      await db.collection("quotations").doc(quotationId).set({
        ...quotationData,
        quotationId: quotationId,
        createdAt: now.toISOString(),
        status: quotationData.status || "pending",
      });
  
      return {
        success: true,
        message: "Quotation created successfully",
        quotation: {
          id: quotationId,
          ...quotationData,
          createdAt: now,
          status: quotationData.status || "Pending",
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
  



  
  async function updateQuotation(updatedData) {
  if (!updatedData || !updatedData.quotationId) {
    throw new Error("Quotation ID and updated data are required");
  }

  const role = updatedData.userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";

  try {
    const ref = db.collection("quotations").doc(updatedData.quotationId);
    const doc = await ref.get();

    if (!doc.exists) {
      return { success: false, message: "Original quotation not found" };
    }

    const oldData = doc.data();

    // Check permission (admins can only update their own quotations)
    if (role !== "super_admin" && oldData.customerEmail !== updatedData.userEmail) {
      return { success: false, message: "Permission denied. You can only update your own quotations." };
    }

    // Create the update object by removing non-updatable fields
    const updateFields = { ...updatedData };
    delete updateFields.quotationId;
    delete updateFields.userEmail;

    // Add updated metadata
    updateFields.updatedAt = new Date().toISOString();
    updateFields.updatedBy = updatedData.userEmail;

    await ref.update(updateFields);

    return {
      success: true,
      message: "Quotation updated successfully",
      quotationId: updatedData.quotationId,
    };

  } catch (error) {
    console.error("Error updating quotation:", error);
    throw new Error("Failed to update quotation");
  }
}

  async function updateQuotationState(Data) {
  if (!Data.quotationId || !Data.newState || !Data.userEmail) {
    throw new Error("Quotation ID, new state, and user email are required");
  }

  const role = Data.userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";

  try {
    const quotationRef = db.collection("quotations").doc(Data.quotationId);
    const quotationeDoc = await quotationRef.get();

    if (!quotationeDoc.exists) {
      return { success: false, message: "Quotation not found" };
    }

    if (role !== "super_admin") {
      return {
        success: false,
        message: "Permission denied: only super admin can update quotation state",
      };
    }

    if (!Data.newState) {
      throw new Error("State value is missing or undefined");
    }

    await quotationRef.update({
      status: Data.newState,
      updatedAt: new Date().toISOString(),
      updatedBy: Data.userEmail,
    });

    return {
      success: true,
      message: `Quotation  state updated to "${Data.newState}"`,
      quotationId: Data.quotationId,
    };

  } catch (error) {
    console.error("Error updating quotation state:", error);
    throw new Error("Failed to update quotation state");
  }
}


  


  
  
  async function deleteQuotation(data) {

    if (!data.quotationId || !data.userEmail) {
      throw new Error("Quotation ID and user email are required");
    }
  
    const role = data.userEmail === process.env.SUPERADMIN ? "super_admin" : "admin";
  
    try {
      const quotationref = db.collection("quotations").doc(data.quotationId);
      const doc = await quotationref.get();
  
      if (!doc.exists) {
        return { success: false, message: "Quotation not found" };
      }
  
      const quotationData = doc.data();
  
      //  Permission check: only super_admins can delete any quotation Admins can only delete quotations they created
       
      if (role !== "super_admin" && quotationData.userEmail !== data.userEmail) {
        return {
          success: false,
          message: "Permission denied: you can only delete your own quotations",
        };
      }
  
      await quotationref.delete();
  
      return { success: true, message: "Quotation deleted successfully" };
    } catch (error) {
      console.error("Error deleting quotation:", error);
      throw new Error("Failed to delete quotation");
    }
  }
  
  


module.exports = {
  createQuotation,getAllQuotations,
  updateQuotation,deleteQuotation,
  updateQuotationState};