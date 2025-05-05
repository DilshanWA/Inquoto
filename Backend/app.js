const express = require("express");
const cors = require("cors");

// const invoiceRoutes = require("./routes/invoiceRoutes");
const { Register ,Login} = require("./middleware/authMiddleware");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// app.use("/api/invoices", invoiceRoutes);
app.post("/api/register", Register); 
app.post("/api/login", Login); 



app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
