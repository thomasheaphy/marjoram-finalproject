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
// const csurf = require("csurf");
const { compare } = require("./bc.js");
const fs = require("fs");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

// MIDDLEWARE
// var csrfExclusion = ["/upload"];

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

// app.use(function (req, res, next) {
//     if (csrfExclusion.indexOf(req.path) !== -1) {
//         next();
//     } else {
//         csrf()(req, res, next);
//     }
// });

// app.use(function (req, res, next) {
//     res.setHeader("x-frame-options", "deny");
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

app.use(express.static("public"));

app.use(express.json());

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let path = `./public/images/`;
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
                            res.render("index", {
                                loginError:
                                    "Username or password error. Please try again",
                            });
                        }
                    }
                );
            }
        })
        .catch((err) => {
            console.log("Login error: ", err);
            res.render("index", {
                loginError: "Username or password error. Please try again",
            });
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
            console.log(":category Result: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error in getting categories: ", err);
        });
});

app.get("/categories/:category", (req, res) => {
    res.render("portfolio");
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

app.get("/images/delete/:imageId", (req, res) => {
    console.log(":imageId - req.params: ", req.params);
    db.deleteImage(req.params.imageId)
        .then((result) => {
            console.log("imageId result: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("Error in getting imageId: ", err);
        });
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            // console.log("images Result: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error in getting images: ", err);
        });
});

app.post("/upload", upload.single("file"), (req, res) => {
    console.log("Uploading..");
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);
    if (req.file) {
        const { title, description, category } = req.body;
        const path = `/images/${req.file.filename}`;
        console.log("req.file: ", req.file.filename);
        db.addImages(title, description, path, category)
            .then((result) => {
                res.json(result.rows[0]);
            })
            .catch((err) => {
                console.log("Error in uploading", err);
                res.json({
                    success: false,
                });
            });
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
