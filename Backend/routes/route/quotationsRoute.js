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
    const { name, price, status } = req.body;
    const uid = req.uid;
    const data = { name, price, status, uid };
    const result = await createQuotation(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteQuotation(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const result = await updateQuotation(req.params.id, req.body);
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
