const {
  getAllQuotations,
  createQuotation,
  deleteQuotation,
  updateQuotationState,
  updateQuotation,
} = require("../../controllers/quotationController");

const getAll = async (req, res) => {
  try {
    const quotations = await getAllQuotations();
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    
    const result = await createQuotation(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const quotationId = req.params.id;
    const userEmail = req.headers['user-email']; // Get from headers
    if (!quotationId || !userEmail) {
      return res.status(400).json({ message: 'Missing quotationId or userEmail' });
    }
    const result = await deleteQuotation({ quotationId, userEmail });
    if (!result.success) {
      return res.status(403).json({ message: result.message });
    }
    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error("Controller error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await updateQuotation(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const State = async (req, res) => {
  try {
    const quotationId = req.params.documentId;
    const userEmail = req.headers['user-email']; 
    const newState = req.body.state; 
    const result = await updateQuotationState( { quotationId, userEmail, newState });
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


module.exports = {
  getAll,
  create,
  remove,
  update,
  State,
};
