const {
  getAllQuotations,
  createQuotation,
  deleteQuotation,
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
    const userEmail = req.headers['user-email'];
    const result = await deleteQuotation( quotationId, userEmail);
    res.status(200).json(result);
  } catch (error) {
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

module.exports = {
  getAll,
  create,
  remove,
  update,
};
