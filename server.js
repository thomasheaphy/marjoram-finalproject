const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("public"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const upload = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, // files over 2mb cannot be uploaded
    },
});


app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json());

// MAIN PAGE

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            console.log("Result: ", result.rows[0]);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error in getting images: ", err);
        });
});

app.get("/images/:imageId", (req, res) => {
    db.selectImage(req.params.imageId)
        .then((result) => {
            console.log("imageId result: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("Error in getting imageId: ", err);
        });
});

app.post("/upload", upload.single("file"), s3.upload, (req, res) => {
    console.log("Upload successful");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    if (req.file) {
        const { title, description, username } = req.body;
        const url = s3Url + req.file.filename;
        db.addImages(title, description, username, url)
            .then((result) => {
                res.json(result.rows[0]);
            })
            .catch((err) => console.log("Error in uploading", err));
    } else {
        res.json({
            success: false,
        });
    }
});



// REDIRECT TO ROUTE

app.get("*", (req, res) => {
    res.redirect("/");
});

// RUN SERVER

app.listen(8080, () => console.log("Server running..."));
