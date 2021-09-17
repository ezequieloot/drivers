const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const uuid = require("uuid")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "images/",
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const connection = require("./db");

router.get("/", (req, res) => {
    connection.query("SELECT * FROM drivers", (error, result) => {
        res.render("index", { result: result });
    });
});

router.post("/store", upload.single("file"), (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const tel = req.body.tel;
    const image = req.file.filename;

    connection.query("INSERT INTO drivers SET ?", {
        name: name,
        surname: surname,
        email: email,
        tel: tel,
        image: image,
    }, (error, result) => {
        res.redirect("/");
    });
});

router.get("/edit/:id", (req, res) => {
    const id = req.params.id;

    connection.query("SELECT * FROM drivers WHERE id = ?", [id], (error, result) => {
        res.render("edit", { result: result[0] });
    });
});

router.post("/update", upload.single("file"), (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const tel = req.body.tel;
    var image = req.body.replace;

    if(req.file)
    {
        image = req.file.filename;
        fs.unlinkSync("images/" + req.body.replace);
    }

    connection.query("UPDATE drivers SET ? WHERE id = ?", [{
        name: name,
        surname: surname,
        email: email,
        tel: tel,
        image: image,
    }, id], (error, result) => {
        res.redirect("/");
    });
});

router.get("/destroy/:id/:image", (req, res) => {
    const id = req.params.id;
    const image = "images/" + req.params.image;

    connection.query("DELETE FROM drivers WHERE id = ?", [id], (error, result) => {
        res.redirect("/");
    });

    if(fs.existsSync(image))
    {
        fs.unlinkSync(image);
    }
});

module.exports = router;