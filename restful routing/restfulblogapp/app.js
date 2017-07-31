var  express           = require("express"),
     app              = express(),
     bodyparser       = require("body-parser"),
     methodoverride   = require("method-override"),
     expresssanitizer = require("express-sanitizer"),
     mongoose         = require("mongoose");

//app configure
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(expresssanitizer());
app.use(methodoverride("_method"));

//mongoose/model/configure
var blogschema = new mongoose.Schema({
	title:  String,
	image:  String,
	 body:  String,
	created: {type: Date, default: Date.now}
});
var blog = mongoose.model("blog",blogschema);

//restful routes

app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	// res.render("index");
     blog.find({},function(err,blogs){
         if(err){
         	console.log("error");
         }
         else{
         	res.render("index",{ blogs: blogs});
         }
     });
});

//new route
app.get("/blogs/new",function(req,res){
	res.render("new");
})

//create route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
	blog.create(req.body.blog, function(err,newblogs){
		if(err){
			res.render("new");
		}
		else{
			//then redirect to index
			res.redirect("/blogs");
		}
	})
});

//show page
app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog: foundblog});
		}
	});  
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog: foundblog});
		}
	});
})

 //update route
app.put("/blogs/:id",function(req,res){
	//blog.findByIdAndUpdate(id,newdata,callback)
	req.body.blog.body = req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
})

//delete route
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
})

app.listen(3000,function(){
	console.log("blog app server is running...");
})