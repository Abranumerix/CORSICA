require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const cors = require ("cors")
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

mongoose
    .set('strictQuery', false)
    .connect(MONGO_URI)
    .then(() => console.log("La connexion à la BDD est établie"))
    .catch((error) => console.log(error))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Route 
const userRoute = require("./routes/userRoute");
app.use("/user", userRoute);

const commentRoute = require("./routes/commentRoute");
app.use("/comment", commentRoute);

const articleRoute = require("./routes/articleRoute");
app.use("/article", articleRoute);

const categoryRoute = require("./routes/categoryRoute");
app.use("/category", categoryRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Le serveur est à l'écoute sur le port http://localhost:${PORT}`));
