//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const items = ["Eat Food", "Get home", "Study", "Catch some sleep"];
const workItems = [];

const { parse } = require("path/win32");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res) {
    
  const day = date.getDate();  

res.render("list", {ListTitle: day, listItems: items});

});

app.post("/", function(req, res) {
    const item = req.body.Todo;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work")
    } else {
        items.push(item);
        res.redirect("/");
    }

    console.log(req.body);
    
    items.push(item);

    res.redirect("/");
});
   

app.get("/work", function(req, res) {
    res.render("list", {ListTitle: "Work List", listItems: workItems})
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("server ready");
})
