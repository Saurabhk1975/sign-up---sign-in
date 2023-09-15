const express = require("express");
/*const { model } = require("mongoose");*/
const user = require("./database");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookieparser = require("cookie-parser");


// this is home page router
router.get("/", (req, res) => {
  res.render("index");
  
});

router.get("/loginn", (req, res) => {
  res.send(`${req.cookies.jwt}`);
});

// user registration page
router.post("/register", async (req, res) => {
  try {
    const data = new user(req.body);
    if (data.password === data.confpassword) {
      const emailvalidation = await user.findOne({ email: data.email });
      if (emailvalidation) {
        res.send("this email already exist pls login");
      }

      const token = await data.generateToken();
      console.log("this token is user" + token);

      res.cookie("jwt", token);

      const savedata = await data.save();
      res.render("login");
    } else {
      res.status(400).send("this is not right pls fill correct detail");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// login API

router.post("/login", async (req, res) => {
  try {
    console.log("login page");
    const passworduser = req.body.password;
    const checkemail = req.body.email;
    const databasedata = await user.findOne({ email: checkemail });
    const ismatch = await bcrypt.compare(passworduser, databasedata.password);
    console.log("login page" + ismatch);
    if (ismatch) {
      const token = await databasedata.generateToken();
      res.cookie("jwt", token);
      res.render("contact");
      //   res.send(`<h1>${databasedata.email}</h1>`)
    } else {
      res.status(400).send("this is not right pls fill correct detail");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
