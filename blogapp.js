require('dotenv').config();
var express = require("express");
var app = express();
var ejs = require('ejs');
var socketio=require('socket.io')
const SMS = require('node-sms-send')
 
const sms = new SMS('username', 'password')
 
sms.send('+917289048592', 'Hello!')
  .then(body => console.log(body)) // returns { message_id: 'string' }
  .catch(err => console.log(err.message))
var methodOverride = require("method-override");
var bodyparser = require("body-parser");
const md5 = require("md5");
app.use(bodyparser.urlencoded({ extended: true }));
var mongoose = require("mongoose");
app.use(methodOverride("_method"));
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/blogsdb", { useNewUrlParser: true }, function (err) { console.log("mongoDB connected", err); });
var blogSchema = new mongoose.Schema({
    title: String,
    url: String,
    description: String,
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

const User = new mongoose.model("User", userSchema);

var employeedb = mongoose.model("blognewdb", blogSchema);
// employeedb.create({ title: "Samsung Launch it's new Smartphone", url: "www.samsung.com", description: "On the eve of independence day samsung launched it's brandnew smartphone" },function(err,newdata)
//     {
//         if(err)
//         {
//             console.log(err);
//         }
//         else{
//             console.log(newdata);
//         }
//     })
// app.get("/", function (req, res) {
//     res.redirect("/blogs")
// });

app.get("/", function (req, res) {
    res.render("home.ejs");
  });
  
  app.get("/login", function (req, res) {
    res.render("login.ejs");
  });
  
  app.get("/register", function (req, res) {
    res.render("register.ejs");
  });
  
  app.post("/register", function (req, res) {
    const newUser = new User({
      email: req.body.username,
      password: md5(req.body.password)
    });
    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("login.ejs");
      }
    });
  });
  
  app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);
  
    User.findOne({
      email: username
    }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets.ejs");
          } else {
            res.render("login-failed.ejs");
          }
        }
      }
    });
  });

app.get("/blogs", function (req, res) {
    employeedb.find({},function(err,allblogs)
    {
            if(err)
            {
                console.log(err);
            }else{
                res.render("index.ejs",{blogs:allblogs});
            }
    });
});
app.get("/home",function(req,res)
{
    res.render("subject.ejs");
});
app.post("/blogs",function(req,res)
{
     var title=req.body.title;
     var  url = req.body.url;
     var description = req.body.description;
     var blogobj = {title:title,url:url,description:description};
     employeedb.create(blogobj,function(err,newobj){
         if(err)
         {
             console.log(err)
         }
     else
     {
     res.redirect("/blogs") 
     }
 });
});
app.get("/blogs/new",function(req,res)
{
    res.render("blogsform.ejs");
});
app.get("/blogs/:id/edit",function(req,res)
{
    var id = req.params.id;
    employeedb.findById(id,function(err,showblog1)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("editform.ejs",{showblog1:showblog1});
        }
    });

});
app.get("/blogs/:id",function(req,res)
{
     var id = req.params.id;
     employeedb.findById(id,function(err,showblog)
     {
         if(err)
         {
             console.log(err);
         }
         else
         {
             res.render("show1.ejs",{showblog:showblog});
         }
     });
});
app.put("/blogs/:id",function(req,res)
{ 
     var ide = req.params.id;
     var title = req.body.title;
     var  url = req.body.url;
     var description = req.body.description;
     var blogobj1 = {title:title,url:url,description:description};
    employeedb.findByIdAndUpdate(ide,blogobj1,function(err,updatedblog)
    {
    if(err)
    {
        console.log(err)
    }else{
       res.redirect("/blogs");
    }
    });
});
app.delete("/blogs/:id",function(req,res)
{
employeedb.findByIdAndRemove(req.params.id, function(err)
{
     if(err)
     {
         console.log(err);
     }
     else
     {
         res.redirect("/blogs");
     }
});
});
app.listen(3000, function (){
    console.log("hey the server has started");
});