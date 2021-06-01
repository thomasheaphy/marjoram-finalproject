const express = require("express");
const app = express();
const db = require("./db");
const hb = require("express-handlebars");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cookieSession = require("cookie-session");
const { COOKIE_SECRET } = require("./secrets.json");
const csurf = require("csurf");
const { hash, compare } = require("./bc.js");
const fs = require("fs");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

// MIDDLEWARE

app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.setHeader("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(express.static("public"));

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let path = `./images`;
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {
            callback(null, file.originalname);
        },
    }),
});

// const postForm = multer().none();

// const transporter = nodemailer.createTransport({
//   host: "smtp.live.com",
//   port: 587,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS,
//   },
// });

app.use(express.json());

// MAIN PAGE

app.get("/", (req, res) => {
    console.log("CSurf: ", req.session.csrfSecret);
    res.render("index");
});

app.post("/", (req, res) => {
    console.log("Req.body", req.body);
    console.log("Login POST request");
    db.getUser(req.body.username)
        .then((result) => {
            if (result.rows.length == 0) {
                console.log("Login error: No username found");
            } else {
                compare(req.body.password, result.rows[0].password).then(
                    (match) => {
                        if (match) {
                            console.log("Password matched: ", match);
                            req.session.userId = result.rows[0].id;
                            console.log(
                                "userId cookie activated: ",
                                req.session.userId
                            );
                            res.render("cpanel");
                        } else {
                            res.render("/");
                        }
                    }
                );
            }
        })
        .catch((err) => {
            console.log("Login error: ", err);
            res.render("/");
        });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/cpanel", (req, res) => {
    if (req.session.userId) {
        res.render("cpanel");
    } else {
        res.render("/");
    }
});

// CONTACT FORM

// app.post("/contact", postForm.none(), (req, res) => {
//     console.log("Req.body: ", req.body);

//     Object.keys(res).forEach(function (property) {
//         data[property] = fields[property].toString();
//     });
// });

// IMAGE GALLERY

app.get("/category/:category", (req, res) => {
    console.log("req.params: ", req.params);
    db.selectCategory(req.params.category)
        .then((result) => {
            console.log(":category Result: ", result.rows[0]);
            res.render("portfolio");
            // res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error in getting categories: ", err);
        });
});

app.get("/images", (req, res) => {
    console.log("Get images test");
    db.getImages()
        .then((result) => {
            console.log("images Result: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error in getting images: ", err);
        });
});

app.get("/images/:imageId", (req, res) => {
    console.log(":imageId - req.params: ", req.params);
    db.selectImage(req.params.imageId)
        .then((result) => {
            console.log("imageId result: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("Error in getting imageId: ", err);
        });
});

app.post("/upload", upload.single("file"), (req, res) => {
    console.log("Upload successful");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    if (req.file) {
        const { title, description, category } = req.body;
        const path = req.file.path;
        db.addImages(title, description, category, path)
            .then((result) => {
                res.json(result.rows[0]);
                res.redirect("/");
            })
            .catch((err) => console.log("Error in uploading", err));
    } else {
        res.json({
            success: false,
        });
        res.redirect("/");
    }
});

// REDIRECT TO ROUTE

app.get("*", (req, res) => {
    res.redirect("/");
});

// RUN SERVER

app.listen(8080, () => console.log("Server running..."));
