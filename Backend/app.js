const express = require("express");
const cors = require("cors");


const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const Routers = require('./routes/mainRouter');




app.use('/api/vi/', Routers);



//Admin


app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
