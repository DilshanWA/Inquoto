

const {
  createInvoice,
  getAllInvoices,
  deleteInvoice,
  updateInvoice,
  updateInvoiceState
} = require("../../controllers/invoiceController");

const { generatePDF } = require("../../utils/pdfGenerator");

const getAll = async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const invoice = await createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userEmail = req.headers['user-email']; // Get from headers
    if (!invoiceId || !userEmail) {
      return res.status(400).json({ message: 'Missing invoiceId or userEmail' });
    }
    const result = await deleteInvoice({ invoiceId, userEmail });
    if (!result.success) {
      return res.status(403).json({ message: result.message });
    }
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error("Controller error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await updateInvoice(req.body); 
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const State = async (req, res) => {
  try {
    const invoiceId = req.params.documentId;
    const userEmail = req.headers['user-email']; 
    const newState = req.body.state; 
    const result = await updateInvoiceState( { invoiceId, userEmail, newState });
    if (!result.success) {
      return res.status(403).json({ message: result.message });
    }
    if (!result.success) {
      return res.status(403).json({ message: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const genPDF = async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req.body);
    const fileId = req.body.invoiceID || req.body.quotationID || "document";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
    res.send(pdfBuffer); // or use .pipe(stream)
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  create,
  remove,
  update,
   State,
  genPDF,
 
};
