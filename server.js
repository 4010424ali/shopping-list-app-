const express = require("express");
const mongoose = require("mongoose");

// Bring the route file
const items = require("./routes/api/items");

// init the app
const app = express();

// body parser have some middleware
app.use(express.json());

// DB config
const db = require("./config/keys").mongoURI;

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log(err));

app.use("/api/items", items);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running ${port}`));
