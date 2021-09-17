const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/bootstrap", express.static("node_modules/bootstrap/dist/"));
app.use("/images", express.static("images/"));
app.set("view engine", "ejs");

const router = require("./router");
app.use("/", router);

app.listen(3000, () => {
    console.log("Example app listening at http://localhost:3000");
});