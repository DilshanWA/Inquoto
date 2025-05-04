const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/api/invoices", invoiceRoutes);

exports.api = functions.https.onRequest(app);
