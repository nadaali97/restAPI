const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
   useFindAndModify: false
});
const articlesSchema = {
  title: String,
  content:String
};

const Article = mongoose.model("Article", articlesSchema);
app.get("/articles",function(req,res){
Article.find({},function(err,foundArticles){
if(!err){
  res.send(foundArticles);}
  else{res.send(err);}
});

});
app.post("/articles",function(req,res){
  //console.log(req.body.title);
  //console.log(req.body.content);
  const article1=new Article({title:req.body.title,
  content:req.body.content});
  article1.save(function(err){
    if(!err){console.log("no error");}
  });
});
app.delete("/articles",function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("successfuly deleted all articles");
    }
    else{res.send(err);}
  });
});


app.route("/articles/:articleTitle")

.get(function(req,res){
Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
  if(foundArticle){
res.send(foundArticle);}
else{res.send("No article found");}
});
})

.put(function(req,res){
Article.update({title:req.params.articleTitle},
  {title:req.body.title,content:req.body.content},
  {overwrite:true},
  function(err){
    if(!err){
      res.send("successfuly updated");
    }
    else{res.send(err);}
  });
})
.patch(function(req,res){
Article.update({title:req.params.articleTitle},
  {$set:req.body},
  {overwrite:true},
  function(err){
    if(!err){
      res.send("successfuly updated");
    }
    else{res.send(err);}
  });
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("successfuly deleted article");
    }
    else{res.send(err);}
  });
});


app.listen(3000,function(){console.log("server running on port 3000")});
