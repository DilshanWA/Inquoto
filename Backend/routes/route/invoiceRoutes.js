

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
    const userEmail = req.headers['user-email'];
    const result = await deleteInvoice(invoiceId,userEmail);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await updateInvoice( req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






const  genPDF = async (req, res) => {
  try {
    const pdfBuffer = await generatePDF(req.body);
    const fileId = req.body.invoiceID || req.body.quotationID || "document";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileId}.pdf`
    );
    res.send(pdfBuffer);
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
  genPDF,
 
};
