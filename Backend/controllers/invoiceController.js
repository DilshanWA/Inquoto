const {db} = require("../config/firebase");
const { generatePDF } = require("../utils/pdfGenerator");

exports.createInvoice = async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("invoices").add(data);

    await generatePDF(data); // Optional: Save to storage/send email

    res.status(201).json({ id: docRef.id, message: "Invoice created" });
  } catch (err) {
    res.status(500).json({ message: "Error creating invoice", error: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const snapshot = await db.collection("invoices").get();
    const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invoices" });
  }
};
