const express = require("express");
const cors = require("cors");


const superAdminRoutes = require('./routes/userRoute')

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());




//superadmin
app.use("/api/super-admin", superAdminRoutes);



//Admin


app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
