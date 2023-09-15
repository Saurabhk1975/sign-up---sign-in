const express = require("express");
const app = express();
const port = 1335;
const router = require("./router")

// data base me data ko save yani engilsh m hi save karne ke liye ye likhna padta hai
app.use(express.json());

// browser ke data ko data base me le jane ke liye
app.use(express.urlencoded({extended:false}));


// setting view engine
app.set("view engine","ejs" );

app.use(router);


app.listen(port,()=>{
    console.log("server is Running on "+ port);
})