//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");



const { parse } = require("path/win32");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-redox:Zainab20*@cluster0.d5u0t.mongodb.net/todoListDB', {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
    name: "Welcome to your todoList"
});

const item2 = new Item({
    name: "Click the + button to aff a new line"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultitems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems) {
            if (foundItems.length == 0) {
                Item.insertMany(defaultitems, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("DataBase updated Successfully");
        }
    });
    res.redirect("/");

        } else {
//            mongoose.connection.close();
//            console.log(foundItems);

            res.render("list", {ListTitle: "Today", listItems: foundItems});
                           
        }
    });

});

app.post("/", function(req, res) {
    const itemName = req.body.Todo;
    const listName = req.body.list;

    const item = new Item ({
        name: itemName
    });

    if (listName === "Today") {
        item4.save();
    res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    const item4 = new Item({
        name: itemName
    });

    

//    if (req.body.list === "Work") {
//        workItems.push(item);
//        res.redirect("/work")
//    } else {
//        items.push(item);
//        res.redirect("/");
//    }
//
//    console.log(req.body);
//    
//    items.push(item);
//
//    res.redirect("/");
});
   
app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndDelete(checkedItemId, function(err) {
            if(!err) {
                console.log("Data Successfully Deleted");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }


    
});

//app.get("/work", function(req, res) {
//    res.render("list", {ListTitle: "Work List", //listItems: workItems})
//});


app.get("/:customListName", function(req, res) {    
        
const customListName = _.capitalize(req.params.customListName);


List.findOne({name: customListName}, function(err, foundList) {
    if(!err) {
        if (!foundList) {
            //Create new List
            const list = new List({
                name: customListName,
                items: defaultitems
            });
            
            list.save();
            res.redirect("/" + customListName);
        } else {
            //Existing List
            res.render("list", {ListTitle: foundList.name, listItems: foundList.items})
        }
    }
});


});





app.get("/about", function(req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port, function() {
    console.log("server ready");
})
